import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, RiskLevel, SensorData, UserContext } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    possible_causes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Non-medical, wellness-focused explanations for symptoms."
    },
    pattern_insights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Observations based on sensor data correlation."
    },
    risk_level: {
      type: Type.STRING,
      enum: [RiskLevel.Low, RiskLevel.Medium, RiskLevel.High],
      description: "General wellness risk assessment."
    },
    immediate_steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable immediate advice."
    },
    daily_recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Habit changes for the long term."
    },
    summary: {
      type: Type.STRING,
      description: "A concise 2-3 line summary of the analysis."
    }
  },
  required: ["possible_causes", "pattern_insights", "risk_level", "immediate_steps", "daily_recommendations", "summary"]
};

export const analyzeHealthData = async (
  sensorData: SensorData,
  userContext: UserContext
): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as an AI wellness assistant named Smart HealthGuard.
    Analyze the following user data.
    
    User Context:
    - Symptoms: ${userContext.symptoms || "None reported"}
    - Lifestyle: ${userContext.lifestyle}
    - Diet Habits: ${userContext.diet}

    IoT Sensor Data (Current Readings):
    - Heart Rate: ${sensorData.heartRate} bpm
    - Body Temperature: ${sensorData.temperature}°C
    - Steps Today: ${sensorData.steps}
    - Sleep last night: ${sensorData.sleepHours} hours
    - Calculated Stress Level (1-10): ${sensorData.stressLevel}
    - Blood Oxygen (SpO2): ${sensorData.bloodOxygen}%

    Task:
    1. Identify potential wellness issues based on correlations (e.g., high stress + low sleep).
    2. Provide safe, non-medical explanations.
    3. Suggest actionable wellness steps.
    
    CONSTRAINT: DO NOT Provide a medical diagnosis. If signs are critical (e.g., extremely high HR or Temp), strictly advise seeing a doctor as an immediate step.
    
    Return the response strictly in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Keep it grounded
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};