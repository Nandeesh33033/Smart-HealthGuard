import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Zap, CheckCircle, Activity, BookOpen } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

export const AnalysisResultView: React.FC<Props> = ({ result }) => {
  
  const getRiskConfig = (level: RiskLevel) => {
    switch(level) {
      case RiskLevel.Low: return { color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200', icon: ShieldCheck, title: 'Healthy' };
      case RiskLevel.Medium: return { color: 'bg-amber-100 text-amber-800', border: 'border-amber-200', icon: AlertTriangle, title: 'Caution' };
      case RiskLevel.High: return { color: 'bg-rose-100 text-rose-800', border: 'border-rose-200', icon: AlertOctagon, title: 'Attention Needed' };
      default: return { color: 'bg-slate-100', border: 'border-slate-200', icon: ShieldCheck, title: 'Unknown' };
    }
  };

  const riskConfig = getRiskConfig(result.risk_level);
  const RiskIcon = riskConfig.icon;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header / Summary Card */}
      <div className={`p-6 rounded-2xl border ${riskConfig.border} ${riskConfig.color} bg-opacity-50 flex flex-col md:flex-row items-start md:items-center gap-4`}>
        <div className={`p-4 rounded-full bg-white bg-opacity-60 shadow-sm shrink-0`}>
          <RiskIcon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Risk Level</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-white bg-opacity-50">{result.risk_level}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Analysis Summary</h2>
          <p className="leading-relaxed opacity-90">{result.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Possible Causes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
            <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
            Possible Explanations
          </h3>
          <ul className="space-y-3">
            {result.possible_causes.map((item, idx) => (
              <li key={idx} className="flex items-start text-slate-600 text-sm">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pattern Insights */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
            <Activity className="w-5 h-5 mr-2 text-purple-500" />
            Pattern Insights
          </h3>
          <ul className="space-y-3">
            {result.pattern_insights.map((item, idx) => (
              <li key={idx} className="flex items-start text-slate-600 text-sm">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Immediate Steps - Full Width */}
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm">
        <h3 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
          <Zap className="w-5 h-5 mr-2 text-indigo-600" />
          Immediate Actions (Wellness Focused)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.immediate_steps.map((step, idx) => (
              <div key={idx} className="flex items-start bg-white p-3 rounded-lg border border-indigo-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold mr-3 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-700 text-sm font-medium">{step}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Daily Recommendations */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="flex items-center text-lg font-semibold text-slate-800 mb-4">
            <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
            Daily Habits
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {result.daily_recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start py-2 border-b border-slate-50 last:border-0">
                 <CheckCircle className="w-4 h-4 mr-3 text-teal-400 mt-0.5 shrink-0" />
                 <span className="text-slate-600 text-sm">{rec}</span>
              </li>
            ))}
          </ul>
      </div>
      
      <p className="text-center text-xs text-slate-400 mt-8">
        Disclaimer: Smart HealthGuard is an AI assistant for educational wellness purposes only. It does not provide medical diagnoses. Always consult a healthcare professional for medical advice.
      </p>

    </div>
  );
};