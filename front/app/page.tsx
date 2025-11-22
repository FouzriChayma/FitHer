"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Sparkles, Calculator, BarChart3, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { type Language, getTranslation } from "@/lib/i18n";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const t = getTranslation(language);
  const isRTL = language === "ar";

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-rose-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-12 h-12 text-rose-400 fill-rose-400/30" />
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                {t.home.heroTitle}
              </h1>
              <Heart className="w-12 h-12 text-rose-400 fill-rose-400/30" />
            </div>
            <p className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white text-lg px-8 py-6"
              >
                <Link href="/calculator" className="flex items-center gap-2">
                  {t.home.calculateNow}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 text-lg px-8 py-6"
              >
                <Link href="/signup">{t.home.getStarted}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {t.home.whyChoose}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t.home.whyChooseSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {t.home.navyMethod}
              </h3>
              <p className="text-slate-600">
                {t.home.navyMethodDesc}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {t.home.comprehensiveAnalysis}
              </h3>
              <p className="text-slate-600">
                {t.home.comprehensiveAnalysisDesc}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {t.home.forWomen}
              </h3>
              <p className="text-slate-600">
                {t.home.forWomenDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-12 text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-rose-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home.readyToStart}
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              {t.home.readyToStartDesc}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6"
            >
              <Link href="/calculator" className="flex items-center gap-2">
                {t.home.tryItNow}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
              <span className="text-lg font-semibold">FitHer AI</span>
            </div>
            <p className="text-sm text-slate-400">
              {t.home.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
