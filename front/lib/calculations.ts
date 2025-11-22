/**
 * Calculate body fat percentage using U.S. Navy Method for Women
 * Formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
 * 
 * @param waist - Waist circumference in cm
 * @param hip - Hip circumference in cm
 * @param neck - Neck circumference in cm
 * @param height - Height in cm
 * @returns Body fat percentage (0-100)
 */
export function calculateBodyFatPercentage(
  waist: number,
  hip: number,
  neck: number,
  height: number
): number {
  if (waist <= 0 || hip <= 0 || neck <= 0 || height <= 0) {
    return 0;
  }

  const logSum = Math.log10(waist + hip - neck);
  const logHeight = Math.log10(height);
  
  const bodyFat = 495 / (1.29579 - 0.35004 * logSum + 0.22100 * logHeight) - 450;
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, bodyFat));
}

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / height (m)²
 * 
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @returns BMI value
 */
export function calculateBMI(weight: number, height: number): number {
  if (weight <= 0 || height <= 0) {
    return 0;
  }

  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Get BMI classification
 * @param bmi - BMI value
 * @param lang - Language code for translations
 * @returns Classification object with category key and color
 */
export function getBMIClassification(bmi: number, lang: string = "en"): {
  category: string;
  categoryKey: "underweight" | "normal" | "overweight" | "obese";
  color: string;
} {
  const classifications = {
    underweight: { key: "underweight", color: "text-blue-600" },
    normal: { key: "normal", color: "text-green-600" },
    overweight: { key: "overweight", color: "text-yellow-600" },
    obese: { key: "obese", color: "text-red-600" },
  };

  if (bmi < 18.5) {
    return { 
      category: classifications.underweight.key, 
      categoryKey: "underweight",
      color: classifications.underweight.color 
    };
  } else if (bmi < 25) {
    return { 
      category: classifications.normal.key, 
      categoryKey: "normal",
      color: classifications.normal.color 
    };
  } else if (bmi < 30) {
    return { 
      category: classifications.overweight.key, 
      categoryKey: "overweight",
      color: classifications.overweight.color 
    };
  } else {
    return { 
      category: classifications.obese.key, 
      categoryKey: "obese",
      color: classifications.obese.color 
    };
  }
}

/**
 * Calculate Fat Mass in kg
 * @param weight - Total weight in kg
 * @param bodyFatPercentage - Body fat percentage (0-100)
 * @returns Fat mass in kg
 */
export function calculateFatMass(weight: number, bodyFatPercentage: number): number {
  return (weight * bodyFatPercentage) / 100;
}

/**
 * Calculate Lean Body Mass in kg
 * @param weight - Total weight in kg
 * @param fatMass - Fat mass in kg
 * @returns Lean body mass in kg
 */
export function calculateLeanBodyMass(weight: number, fatMass: number): number {
  return weight - fatMass;
}

/**
 * Estimate maintenance calories using Mifflin-St Jeor Equation for women
 * Formula: (10 × weight) + (6.25 × height) - (5 × age) - 161
 * 
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @param activityLevel - Activity multiplier (1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 active, 1.9 very active)
 * @returns Maintenance calories per day
 */
export function estimateMaintenanceCalories(
  weight: number,
  height: number,
  age: number,
  activityLevel: number = 1.375
): number {
  if (weight <= 0 || height <= 0 || age <= 0) {
    return 0;
  }

  const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  return Math.round(bmr * activityLevel);
}

/**
 * Calculate safe fat-loss calories
 * @param maintenanceCalories - Maintenance calories per day
 * @param deficit - Calorie deficit (300 or 500)
 * @returns Fat-loss calories per day
 */
export function calculateFatLossCalories(
  maintenanceCalories: number,
  deficit: number = 500
): number {
  return Math.max(1200, maintenanceCalories - deficit); // Minimum 1200 calories
}

