# 💪 FitHer AI – Phase 1 (Super Simple MVP)

**"Body Fat & BMI Calculator for Women"** (React + Next.js + Node.js)

---

## 🎯 Goal of Phase 1

Enable any woman to input 4–5 body measurements and instantly receive:

- Body Fat %
- Fat Mass & Lean Mass
- BMI (Body Mass Index)
- Daily calorie estimate for safe fat loss
- A visually appealing results page that can be saved or shared

This MVP lays the foundation for future phases, which will include workouts, meal plans, cycle tracking, and more.

---

## 🔥 Core Features (Only 2 Screens!)

### 1. Measurement Input Screen

User-friendly form collects:
- Age (years)
- Height (cm)
- Weight (kg)
- Neck circumference (cm)
- Waist circumference (cm)
- Hip circumference (cm)
- Gender → Fixed to "Woman" (toggle optional, default female)

### 2. Results Screen (Instant)

Displays results in clean, visually appealing cards:
- Body Fat % (calculated via U.S. Navy Method – highly accurate for women)
- BMI + classification (Underweight / Normal / Overweight / Obese)
- Fat Mass (kg)
- Lean Body Mass (kg)
- Estimated Maintenance Calories
- Safe Fat-Loss Calories (-300 or -500 kcal deficit)
- "Save Result" button (stores data in localStorage; future upgrade to MongoDB)
- Share button (via native Web Share API)

---

## 🛠️ Tech Stack (Phase 1)

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React.js + Next.js       |
| Styling  | Tailwind CSS + shadcn/ui |
| Backend  | Node.js                  |

---

## 📊 Navy Formula (Women)

```typescript
const bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
```

- Accuracy: ±3% compared to DEXA for most women

---

## 🇹🇳 Tunisian Touch (Phase 1)

- Multilingual: Arabic, French, English (3 simple JSON files)
- Units: cm for height, kg for weight (common in Tunisia)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FouzriChayma/FitHer.git
cd FitHer-AI
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Project Structure

```
FitHer-AI/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components (to be created)
├── lib/                 # Utility functions (to be created)
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🎨 Next Steps

- [ ] Set up shadcn/ui
- [ ] Create measurement input form
- [ ] Implement Navy formula calculations
- [ ] Create results display page
- [ ] Add multilingual support (Arabic, French, English)
- [ ] Add localStorage for saving results
- [ ] Implement share functionality

---

## 📄 License

This project is private and proprietary.

---

Made with 💪 for women's health and fitness

