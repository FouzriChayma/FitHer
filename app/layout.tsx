import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitHer AI - Body Fat & BMI Calculator",
  description: "Calculate your body fat percentage, BMI, and daily calorie needs - designed for women",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

