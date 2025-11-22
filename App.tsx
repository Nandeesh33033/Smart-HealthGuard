import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import { SensorCard } from './components/SensorCard';
import { Charts } from './components/Charts';
import { AnalysisResultView } from './components/AnalysisResult';
import { SensorData, UserContext, AnalysisResult, HistoricalPoint } from './types';
import { analyzeHealthData } from './services/geminiService';
import { Heart, Thermometer, Footprints, Moon, Brain, Activity, Sparkles, RefreshCw, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  // State for Sensor Data (simulated IoT)
  const [sensorData, setSensorData] = useState<SensorData>({
    heartRate: 72,
    temperature: 36.6,
    steps: 4500,
    sleepHours: 7.5,
    stressLevel: 3,
    bloodOxygen: 98
  });

  // State for User Inputs
  const [userContext, setUserContext] = useState<UserContext>({
    symptoms: "",
    lifestyle: "Moderately Active",
    diet: "Balanced"
  });

  // State for App Flow
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoricalPoint[]>([]);

  // Generate mock historical data based on current sensor readings
  const generateHistory = useCallback(() => {
    const points: HistoricalPoint[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const time = new Date(now.getTime() - (11 - i) * 3600 * 1000); // Past 12 hours
      // Add some random variance to the current value to make it look like a trend
      const variance = (Math.random() - 0.5) * 10; 
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        heartRate: Math.max(40, Math.min(180, Math.round(sensorData.heartRate + variance))),
        stress: Math.max(1, Math.min(10, Math.round(sensorData.stressLevel + (Math.random() - 0.5) * 2)))
      });
    }
    setHistoryData(points);
  }, [sensorData.heartRate, sensorData.stressLevel]);

  // Update history when main sensor data changes significantly (debounced effectively by effect dependency)
  useEffect(() => {
    generateHistory();
  }, [generateHistory]);

  const handleSensorChange = (key: keyof SensorData, value: number) => {
    setSensorData(prev => ({ ...prev, [key]: value }));
    // Clear result when data changes to encourage re-analysis
    // setResult(null); 
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeHealthData(sensorData, userContext);
      setResult(data);
    } catch (e) {
      setError("Unable to generate analysis. Please check your connection or API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs & Controls */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Simulation Panel */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-teal-600" />
                  Live Sensor Data
                </h2>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">Connected</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <SensorCard 
                  title="Heart Rate" 
                  value={sensorData.heartRate} 
                  unit="bpm" 
                  icon={Heart} 
                  colorClass="bg-rose-500" 
                  min={40} max={180} 
                  onChange={(v) => handleSensorChange('heartRate', v)}
                  description="Current pulse rate."
                />
                <SensorCard 
                  title="Stress Level" 
                  value={sensorData.stressLevel} 
                  unit="/ 10" 
                  icon={Brain} 
                  colorClass="bg-indigo-500" 
                  min={1} max={10} 
                  onChange={(v) => handleSensorChange('stressLevel', v)}
                  description="HRV-based stress estimation."
                />
                <SensorCard 
                  title="Sleep Duration" 
                  value={sensorData.sleepHours} 
                  unit="hrs" 
                  icon={Moon} 
                  colorClass="bg-purple-500" 
                  min={0} max={12} step={0.5}
                  onChange={(v) => handleSensorChange('sleepHours', v)}
                  description="Total sleep recorded last night."
                />
                 <SensorCard 
                  title="Body Temp" 
                  value={sensorData.temperature} 
                  unit="°C" 
                  icon={Thermometer} 
                  colorClass="bg-orange-500" 
                  min={35} max={42} step={0.1}
                  onChange={(v) => handleSensorChange('temperature', v)}
                  description="Skin temperature average."
                />
              </div>
            </section>

            {/* Manual Input */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">User Input</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">How are you feeling?</label>
                  <textarea 
                    className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2 h-24 resize-none"
                    placeholder="E.g., I feel tired after lunch, slight headache..."
                    value={userContext.symptoms}
                    onChange={(e) => setUserContext({...userContext, symptoms: e.target.value})}
                  />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Lifestyle Activity</label>
                   <select 
                      className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2"
                      value={userContext.lifestyle}
                      onChange={(e) => setUserContext({...userContext, lifestyle: e.target.value})}
                   >
                      <option>Sedentary (Office job, little exercise)</option>
                      <option>Lightly Active (Walking, light chores)</option>
                      <option>Moderately Active (Exercise 3-5x/week)</option>
                      <option>Very Active (Daily heavy exercise)</option>
                   </select>
                </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Recent Diet Habits</label>
                   <select 
                      className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm p-2"
                      value={userContext.diet}
                      onChange={(e) => setUserContext({...userContext, diet: e.target.value})}
                   >
                      <option>Balanced / Healthy</option>
                      <option>High Sugar / Processed</option>
                      <option>High Protein / Low Carb</option>
                      <option>Vegetarian / Vegan</option>
                      <option>Irregular Eating Patterns</option>
                   </select>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Visualization & Analysis */}
          <div className="xl:col-span-2 flex flex-col h-full">
             
             {/* Charts Section */}
             <Charts data={historyData} />

             {/* Action Bar */}
             <div className="mb-6 flex justify-end">
                <button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                  className={`
                    relative overflow-hidden group
                    px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-teal-500/30
                    transition-all duration-300
                    ${isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-[1.02] hover:shadow-teal-500/40'}
                  `}
                >
                  <div className="flex items-center gap-2">
                     {isAnalyzing ? (
                       <RefreshCw className="w-5 h-5 animate-spin" />
                     ) : (
                       <Sparkles className="w-5 h-5" />
                     )}
                     <span>{isAnalyzing ? 'Analyzing Data...' : 'Generate Health Insights'}</span>
                  </div>
                  {/* Shine Effect */}
                  {!isAnalyzing && (
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shiny" />
                  )}
                </button>
             </div>

             {/* Results Section */}
             <div className="flex-1 min-h-[400px]">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
                    <AlertOctagon className="w-5 h-5 mr-2" />
                    {error}
                  </div>
                )}

                {!result && !isAnalyzing && !error && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <div className="bg-teal-50 p-4 rounded-full mb-4">
                      <Brain className="w-12 h-12 text-teal-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600">Ready to Analyze</h3>
                    <p className="text-slate-400 max-w-md mt-2">Adjust the simulated sensor sliders on the left or enter your symptoms, then click "Generate Health Insights" to let the AI identify patterns.</p>
                  </div>
                )}
                
                {/* Skeleton Loader */}
                {isAnalyzing && (
                   <div className="space-y-4 animate-pulse">
                      <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
                        <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
                      </div>
                      <div className="h-40 bg-slate-200 rounded-xl w-full"></div>
                   </div>
                )}

                {result && !isAnalyzing && (
                   <AnalysisResultView result={result} />
                )}
             </div>

          </div>
        </div>
      </main>
      
      <style>{`
        @keyframes shiny {
            0% { left: -100% }
            100% { left: 200% }
        }
        .animate-shiny {
            animation: shiny 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;