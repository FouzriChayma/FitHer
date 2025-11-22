"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { measurementsAPI } from "@/lib/api";
import { type Language } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Scale, 
  Ruler, 
  Calendar,
  Trash2,
  History as HistoryIcon,
  BarChart3,
  Activity
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { format, parseISO } from "date-fns";

interface Measurement {
  _id: string;
  date: string;
  weight: number;
  bodyFatPercentage: number;
  bmi: number;
  waist: number;
  hip: number;
  neck: number;
  fatMass: number;
  leanBodyMass: number;
  height: number;
}

interface Stats {
  totalMeasurements: number;
  firstMeasurement: Measurement | null;
  lastMeasurement: Measurement | null;
  changes: {
    [key: string]: {
      current: number;
      previous: number;
      change: number;
      percentChange: string;
    };
  };
  timeSpan: {
    days: number;
    firstDate: string;
    lastDate: string;
  };
}

export default function HistoryPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"weight" | "bodyFat" | "bmi" | "waist">("weight");
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [measurementsData, statsData] = await Promise.all([
        measurementsAPI.getAll(),
        measurementsAPI.getStats()
      ]);
      setMeasurements(measurementsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("Failed to load measurement history", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this measurement?")) {
      return;
    }

    try {
      const success = await measurementsAPI.delete(id);
      if (success) {
        showToast("Measurement deleted successfully", "success");
        loadData();
      } else {
        showToast("Failed to delete measurement", "error");
      }
    } catch (error) {
      showToast("Failed to delete measurement", "error");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-emerald-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getChangeColor = (change: number, metric: string) => {
    // For weight, waist, bodyFat: decrease is good (green), increase is bad (red)
    // For leanBodyMass: increase is good (green), decrease is bad (red)
    if (metric === "leanBodyMass") {
      return change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-slate-600";
    }
    return change < 0 ? "text-emerald-600" : change > 0 ? "text-red-600" : "text-slate-600";
  };

  const chartData = measurements
    .slice()
    .reverse()
    .map((m) => ({
      date: formatDate(m.date),
      fullDate: m.date,
      weight: m.weight,
      bodyFat: m.bodyFatPercentage,
      bmi: m.bmi,
      waist: m.waist,
      hip: m.hip,
      neck: m.neck,
      fatMass: m.fatMass,
      leanBodyMass: m.leanBodyMass,
    }));

  const metricLabels: { [key: string]: string } = {
    weight: "Weight (kg)",
    bodyFat: "Body Fat %",
    bmi: "BMI",
    waist: "Waist (cm)",
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading history...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (measurements.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20">
          <Navbar language={language} onLanguageChange={setLanguage} />
          <main className="max-w-6xl mx-auto p-4 md:p-8 pt-8">
            <Card className="border border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <HistoryIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">No Measurement History</h2>
                <p className="text-slate-600 mb-6 text-center">
                  Start tracking your progress by calculating your body composition measurements.
                </p>
                <Button
                  onClick={() => router.push("/calculator")}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Calculate Now
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20">
        <Navbar language={language} onLanguageChange={setLanguage} />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800 flex items-center gap-3">
                <HistoryIcon className="w-8 h-8 text-rose-400" />
                Measurement History
              </h1>
              <p className="text-slate-600 mt-1">
                Track your progress over time
              </p>
            </div>
            <Button
              onClick={() => router.push("/calculator")}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Add New Measurement
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.changes)
                .filter(([key]) => ["weight", "bodyFat", "bmi", "waist"].includes(key))
                .map(([key, change]) => (
                  <Card key={key} className="border border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {metricLabels[key] || key}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-semibold text-slate-900">
                            {change.current.toFixed(key === "weight" || key === "waist" ? 1 : 2)}
                          </div>
                          <div className={`text-sm font-medium flex items-center gap-1 mt-1 ${getChangeColor(change.change, key)}`}>
                            {getChangeIcon(change.change)}
                            {change.change > 0 ? "+" : ""}
                            {change.change.toFixed(2)} ({change.percentChange}%)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* Time Span Info */}
          {stats && stats.timeSpan && (
            <Card className="border border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Tracking for <span className="font-semibold text-slate-800">{stats.timeSpan.days}</span> days
                    {" "}({formatDate(stats.timeSpan.firstDate)} - {formatDate(stats.timeSpan.lastDate)})
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart */}
          <Card className="border border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-rose-400" />
                    Progress Chart
                  </CardTitle>
                  <CardDescription>Track your measurements over time</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["weight", "bodyFat", "bmi", "waist"].map((metric) => (
                    <Button
                      key={metric}
                      variant={selectedMetric === metric ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMetric(metric as any)}
                      className={
                        selectedMetric === metric
                          ? "bg-slate-900 hover:bg-slate-800 text-white"
                          : "border-slate-200 text-slate-700"
                      }
                    >
                      {metricLabels[metric]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric === "bodyFat" ? "bodyFat" : selectedMetric}
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", r: 4 }}
                    activeDot={{ r: 6 }}
                    name={metricLabels[selectedMetric]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Measurement List */}
          <Card className="border border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-400" />
                All Measurements ({measurements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Weight</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Body Fat</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">BMI</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Waist</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((measurement, index) => (
                      <tr key={measurement._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-sm text-slate-700">
                          {formatDate(measurement.date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-slate-900">
                          {measurement.weight.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-slate-700">
                          {measurement.bodyFatPercentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-slate-700">
                          {measurement.bmi.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-slate-700">
                          {measurement.waist.toFixed(1)} cm
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(measurement._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

