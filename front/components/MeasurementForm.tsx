"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslation, type Language } from "@/lib/i18n";
import { Heart, Sparkles, Ruler, Scale, User, History } from "lucide-react";

interface MeasurementFormProps {
  onSubmit: (data: MeasurementData) => void;
  language: Language;
}

export interface MeasurementData {
  age: number;
  height: number;
  weight: number;
  neck: number;
  waist: number;
  hip: number;
}

export default function MeasurementForm({ onSubmit, language }: MeasurementFormProps) {
  const t = getTranslation(language);
  const router = useRouter();
  const [formData, setFormData] = useState<MeasurementData>({
    age: 0,
    height: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MeasurementData, string>>>({});

  const handleChange = (field: keyof MeasurementData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData((prev) => ({ ...prev, [field]: numValue }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else if (value === "") {
      setFormData((prev) => ({ ...prev, [field]: 0 }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MeasurementData, string>> = {};
    
    if (!formData.age || formData.age <= 0) newErrors.age = t.form.required;
    if (!formData.height || formData.height <= 0) newErrors.height = t.form.required;
    if (!formData.weight || formData.weight <= 0) newErrors.weight = t.form.required;
    if (!formData.neck || formData.neck <= 0) newErrors.neck = t.form.required;
    if (!formData.waist || formData.waist <= 0) newErrors.waist = t.form.required;
    if (!formData.hip || formData.hip <= 0) newErrors.hip = t.form.required;

    // Basic validation
    if (formData.waist > 0 && formData.neck > 0 && formData.waist <= formData.neck) {
      newErrors.waist = "Waist must be larger than neck";
    }
    if (formData.hip > 0 && formData.neck > 0 && formData.hip <= formData.neck) {
      newErrors.hip = "Hip must be larger than neck";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const isRTL = language === "ar";

  return (
    <Card className="w-full max-w-2xl mx-auto border border-slate-200/80 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6 relative">
        <div className="absolute top-6 right-6 text-rose-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400/30" />
          <CardTitle className="text-3xl font-semibold text-slate-800 tracking-tight">
            {t.title}
          </CardTitle>
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400/30" />
        </div>
        <CardDescription className="text-base text-slate-600 font-normal">
          {t.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 group">
              <Label htmlFor="age" className="text-slate-700 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                {t.form.age}
              </Label>
              <Input
                id="age"
                type="number"
                min="1"
                step="1"
                placeholder="25"
                value={formData.age || ""}
                onChange={(e) => handleChange("age", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.age ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.age && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.age}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="height" className="text-slate-700 font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-slate-400" />
                {t.form.height}
              </Label>
              <Input
                id="height"
                type="number"
                min="1"
                step="0.1"
                placeholder="165"
                value={formData.height || ""}
                onChange={(e) => handleChange("height", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.height ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.height && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.height}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="weight" className="text-slate-700 font-medium flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-400" />
                {t.form.weight}
              </Label>
              <Input
                id="weight"
                type="number"
                min="1"
                step="0.1"
                placeholder="65"
                value={formData.weight || ""}
                onChange={(e) => handleChange("weight", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.weight ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.weight && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.weight}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="neck" className="text-slate-700 font-medium">
                {t.form.neck}
              </Label>
              <Input
                id="neck"
                type="number"
                min="1"
                step="0.1"
                placeholder="32"
                value={formData.neck || ""}
                onChange={(e) => handleChange("neck", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.neck ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.neck && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.neck}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="waist" className="text-slate-700 font-medium">
                {t.form.waist}
              </Label>
              <Input
                id="waist"
                type="number"
                min="1"
                step="0.1"
                placeholder="75"
                value={formData.waist || ""}
                onChange={(e) => handleChange("waist", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.waist ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.waist && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.waist}
                </p>
              )}
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="hip" className="text-slate-700 font-medium">
                {t.form.hip}
              </Label>
              <Input
                id="hip"
                type="number"
                min="1"
                step="0.1"
                placeholder="95"
                value={formData.hip || ""}
                onChange={(e) => handleChange("hip", e.target.value)}
                className={`transition-all focus:border-rose-300 focus:ring-rose-200/50 ${
                  errors.hip ? "border-red-300 ring-red-100" : "border-slate-200"
                }`}
              />
              {errors.hip && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <span className="text-xs">⚠</span> {errors.hip}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2" 
            size="lg"
          >
            <Sparkles className="w-4 h-4" />
            {t.form.calculate}
          </Button>
        </form>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/history")}
            className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            View My History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

