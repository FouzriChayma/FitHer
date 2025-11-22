"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslation, type Language } from "@/lib/i18n";
import { Share2, Save, RotateCcw, Heart, History } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface ResultsData {
  bodyFatPercentage: number;
  bmi: number;
  bmiClassification: { category: string; categoryKey: string; color: string };
  fatMass: number;
  leanBodyMass: number;
  maintenanceCalories: number;
  fatLossCalories300: number;
  fatLossCalories500: number;
}

interface ResultsDisplayProps {
  results: ResultsData;
  measurements: {
    age: number;
    height: number;
    weight: number;
  };
  onNewCalculation: () => void;
  language: Language;
}

export default function ResultsDisplay({
  results,
  measurements,
  onNewCalculation,
  language,
}: ResultsDisplayProps) {
  const t = getTranslation(language);
  const [saved, setSaved] = useState(false);
  const isRTL = language === "ar";
  const { showToast } = useToast();
  const router = useRouter();

  const handleSave = () => {
    // Measurements are now auto-saved to history on calculation
    // This button can show a message or navigate to history
    setSaved(true);
    showToast("Measurement already saved to your history!", "success");
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = async () => {
    const bmiCategory = (t.bmi as any)[results.bmiClassification.categoryKey] || results.bmiClassification.category;
    const shareText = `${t.title}\n${t.subtitle}\n\n${t.results.bodyFat}: ${results.bodyFatPercentage.toFixed(1)}%\n${t.results.bmi}: ${results.bmi.toFixed(1)} (${bmiCategory})\n${t.results.fatMass}: ${results.fatMass.toFixed(1)} ${t.results.kg}\n${t.results.leanMass}: ${results.leanBodyMass.toFixed(1)} ${t.results.kg}\n${t.results.maintenanceCalories}: ${results.maintenanceCalories} ${t.results.kcal}\n${t.results.fatLossCalories}: ${results.fatLossCalories500} ${t.results.kcal}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Results copied to clipboard!", "success");
      } catch (err) {
        showToast(t.shareError, "error");
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400/20" />
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            {t.title}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all ${
              saved ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "text-slate-700"
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? t.saved : t.results.save}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4" />
            {t.results.share}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/history")}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all"
          >
            <History className="w-4 h-4" />
            View History
          </Button>
          <Button
            variant="outline"
            onClick={onNewCalculation}
            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            {t.results.newCalculation}
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Body Fat % */}
        <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.bodyFat}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-slate-900">
              {results.bodyFatPercentage.toFixed(1)}%
            </div>
            <CardDescription className="mt-3 text-slate-500 text-sm">
              U.S. Navy Method (±3% accuracy)
            </CardDescription>
          </CardContent>
        </Card>

        {/* BMI */}
        <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.bmi}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-slate-900">
              {results.bmi.toFixed(1)}
            </div>
            <div className={`mt-3 font-semibold text-base ${results.bmiClassification.color}`}>
              {(t.bmi as any)[results.bmiClassification.categoryKey] || results.bmiClassification.category}
            </div>
          </CardContent>
        </Card>

        {/* Fat Mass */}
        <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.fatMass}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-slate-900">
              {results.fatMass.toFixed(1)}
            </div>
            <CardDescription className="mt-3 text-slate-500 text-sm">{t.results.kg}</CardDescription>
          </CardContent>
        </Card>

        {/* Lean Body Mass */}
        <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.leanMass}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-slate-900">
              {results.leanBodyMass.toFixed(1)}
            </div>
            <CardDescription className="mt-3 text-slate-500 text-sm">{t.results.kg}</CardDescription>
          </CardContent>
        </Card>

        {/* Maintenance Calories */}
        <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.maintenanceCalories}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-semibold text-slate-900">
              {results.maintenanceCalories}
            </div>
            <CardDescription className="mt-3 text-slate-500 text-sm">{t.results.kcal}</CardDescription>
          </CardContent>
        </Card>

        {/* Fat-Loss Calories */}
        <Card className="md:col-span-2 lg:col-span-1 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-slate-700 font-semibold">{t.results.fatLossCalories}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="text-2xl font-semibold text-slate-900">
                {results.fatLossCalories300} {t.results.kcal}
              </div>
              <CardDescription className="mt-2 text-slate-500 text-sm">
                -300 {t.results.kcal.split("/")[0]} deficit
              </CardDescription>
            </div>
            <div className="bg-rose-50/50 rounded-lg p-4 border border-rose-100">
              <div className="text-2xl font-semibold text-slate-900">
                {results.fatLossCalories500} {t.results.kcal}
              </div>
              <CardDescription className="mt-2 text-slate-500 text-sm">
                -500 {t.results.kcal.split("/")[0]} deficit
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

