"use client";

import { useState, useEffect } from "react";
import MeasurementForm, { type MeasurementData } from "@/components/MeasurementForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  calculateBodyFatPercentage,
  calculateBMI,
  getBMIClassification,
  calculateFatMass,
  calculateLeanBodyMass,
  estimateMaintenanceCalories,
  calculateFatLossCalories,
} from "@/lib/calculations";
import { type Language } from "@/lib/i18n";
import { measurementsAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

type View = "form" | "results";

export default function CalculatorPage() {
  const [view, setView] = useState<View>("form");
  const [language, setLanguage] = useState<Language>("en");
  const [results, setResults] = useState<any>(null);
  const [measurements, setMeasurements] = useState<any>(null);
  const [rawMeasurements, setRawMeasurements] = useState<MeasurementData | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const handleFormSubmit = async (data: MeasurementData) => {
    const bodyFatPercentage = calculateBodyFatPercentage(
      data.waist,
      data.hip,
      data.neck,
      data.height
    );

    const bmi = calculateBMI(data.weight, data.height);
    const bmiClassification = getBMIClassification(bmi, language);

    const fatMass = calculateFatMass(data.weight, bodyFatPercentage);
    const leanBodyMass = calculateLeanBodyMass(data.weight, fatMass);

    const maintenanceCalories = estimateMaintenanceCalories(
      data.weight,
      data.height,
      data.age,
      1.375
    );

    const fatLossCalories300 = calculateFatLossCalories(maintenanceCalories, 300);
    const fatLossCalories500 = calculateFatLossCalories(maintenanceCalories, 500);

    setResults({
      bodyFatPercentage,
      bmi,
      bmiClassification,
      fatMass,
      leanBodyMass,
      maintenanceCalories,
      fatLossCalories300,
      fatLossCalories500,
    });

    setMeasurements({
      age: data.age,
      height: data.height,
      weight: data.weight,
    });

    setRawMeasurements(data);
    setView("results");

    // Auto-save to history
    try {
      const measurementData = {
        age: data.age,
        height: data.height,
        weight: data.weight,
        neck: data.neck,
        waist: data.waist,
        hip: data.hip,
        bodyFatPercentage,
        bmi,
        fatMass,
        leanBodyMass,
        maintenanceCalories,
        fatLossCalories300,
        fatLossCalories500,
      };
      
      const saved = await measurementsAPI.save(measurementData);
      if (saved) {
        showToast("Measurement saved to your history!", "success");
      }
    } catch (error) {
      console.error("Error saving measurement:", error);
      // Don't show error toast, as saving is optional
    }
  };

  const handleNewCalculation = () => {
    setView("form");
    setResults(null);
    setMeasurements(null);
    setRawMeasurements(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20">
        <Navbar language={language} onLanguageChange={setLanguage} />
        
        <main className="relative z-10 p-4 md:p-8 pt-8">
          <div className="max-w-6xl mx-auto">
            {view === "form" ? (
              <MeasurementForm onSubmit={handleFormSubmit} language={language} />
            ) : (
              results && (
                <ResultsDisplay
                  results={results}
                  measurements={measurements}
                  onNewCalculation={handleNewCalculation}
                  language={language}
                />
              )
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

