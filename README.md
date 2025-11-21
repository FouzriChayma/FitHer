# 💪 FitHer AI

**Body Fat & BMI Calculator for Women**

FitHer AI is a comprehensive health and fitness application designed specifically for women. Phase 1 focuses on providing accurate body composition analysis using the U.S. Navy Method.

## 🎯 Phase 1 Features

- **Body Fat % Calculation** - Using the highly accurate U.S. Navy Method
- **BMI Calculation** - With classification (Underweight/Normal/Overweight/Obese)
- **Fat Mass & Lean Body Mass** - Detailed body composition breakdown
- **Calorie Estimation** - Maintenance and safe fat-loss calorie recommendations
- **Multilingual Support** - Arabic, French, English (coming soon)
- **Share & Save** - Save results locally and share with others

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- RESTful API

## 📁 Project Structure

```
FitHer-AI/
├── front/          # Next.js frontend application
├── back/           # Node.js backend API
└── README.md       # This file
```

## 🚀 Getting Started

### Frontend Setup

```bash
cd front
npm install
npm run dev
```

Frontend will run on http://localhost:3000

### Backend Setup

```bash
cd back
npm install
npm run dev
```

Backend will run on http://localhost:5000

## 📊 Body Fat Calculation Formula

U.S. Navy Method for Women:

```typescript
const bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
```

Accuracy: ±3% compared to DEXA scan for most women.

## 🌍 Multilingual Support

Phase 1 includes support for:
- 🇹🇳 Arabic (العربية)
- 🇫🇷 French (Français)
- 🇬🇧 English

## 📝 License

MIT

## 👤 Author

Fouzri Chayma

---

**Status:** 🚧 Phase 1 - MVP in Development

