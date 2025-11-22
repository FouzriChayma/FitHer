"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { type Language, getTranslation } from "@/lib/i18n";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = getTranslation(language);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMenuOpen(false);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "ar", label: "العربية", flag: "🇹🇳" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400 fill-rose-400/30" />
            <span className="text-xl font-semibold text-slate-800">FitHer AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/calculator"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              {t.nav.calculator}
            </Link>
            {user ? (
              <>
                <Link
                  href="/history"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  History
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <span className="text-sm hidden sm:inline">{user.name}</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Button
                  asChild
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Link href="/signup">{t.nav.signup}</Link>
                </Button>
              </>
            )}

            {/* Language Selector */}
            <div className="flex gap-1 bg-slate-50 rounded-full p-1 border border-slate-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    language === lang.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base mr-1">{lang.flag}</span>
                  <span className="hidden lg:inline">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-slate-200">
            <Link
              href="/"
              className="block text-slate-600 hover:text-slate-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/calculator"
              className="block text-slate-600 hover:text-slate-900 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.calculator}
            </Link>
            {user ? (
              <>
                <Link
                  href="/history"
                  className="block text-slate-600 hover:text-slate-900 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="block text-slate-600 hover:text-slate-900 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <span className="text-sm">{user.name}</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-slate-600 hover:text-slate-900 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Button
                  asChild
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    {t.nav.signup}
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Language Selector */}
            <div className="flex gap-1 bg-slate-50 rounded-full p-1 border border-slate-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 px-3 py-2 rounded-full text-sm transition-all ${
                    language === lang.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base mr-1">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

