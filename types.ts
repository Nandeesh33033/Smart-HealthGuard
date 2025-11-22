export enum RiskLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export interface AnalysisResult {
  possible_causes: string[];
  pattern_insights: string[];
  risk_level: RiskLevel;
  immediate_steps: string[];
  daily_recommendations: string[];
  summary: string;
}

export interface SensorData {
  heartRate: number; // bpm
  temperature: number; // Celsius
  steps: number; // count
  sleepHours: number; // hours
  stressLevel: number; // 1-10
  bloodOxygen: number; // %
}

export interface UserContext {
  symptoms: string;
  lifestyle: string; // e.g., "Sedentary", "Active"
  diet: string;
}

export interface HistoricalPoint {
  time: string;
  heartRate: number;
  stress: number;
}