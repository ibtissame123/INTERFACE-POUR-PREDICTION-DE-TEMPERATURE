import React from 'react';
import { CloudSun, TrendingUp, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { MOCK_METRICS } from '../services/mockBackend';
import { ModelType } from '../types';

const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">System Dashboard</h2>
        <p className="text-slate-400">Overview of the machine learning pipeline status and performance.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Best Model" 
          value="GRU" 
          subValue={`R²: ${MOCK_METRICS[ModelType.GRU].r2}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard 
          title="Total Samples" 
          value="8,760" 
          subValue="Hourly Data (1 Year)"
          icon={Database}
          color="emerald"
        />
        <StatCard 
          title="System Status" 
          value="Operational" 
          subValue="All models loaded"
          icon={CheckCircle}
          color="purple"
        />
        <StatCard 
          title="Avg Error" 
          value="1.02 °C" 
          subValue="Validation Set"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 border border-slate-700 p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-300 text-sm font-medium mb-4">
            <CloudSun size={16} />
            <span>AI Weather Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Predicting Temperature with Deep Learning
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            This project utilizes a sequence-to-sequence approach. We compare classical methods (Linear Regression, KNN) against modern Recurrent Neural Networks (GRU) to forecast temperature with high precision.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Read Documentation
            </button>
            <button className="bg-blue-600/30 text-white border border-blue-500/50 px-6 py-3 rounded-lg font-bold hover:bg-blue-600/50 transition-colors">
              View Source Code
            </button>
          </div>
        </div>
        
        {/* Abstract Art/Pattern */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
        <div className="absolute right-10 bottom-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg text-white mb-4">Data Features</h3>
            <ul className="space-y-3">
              {[
                "Temperature (C)", "Humidity (%)", "Wind Speed (km/h)", 
                "Hour of Day", "Day of Week", "Is Weekend", "Month"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {f}
                </li>
              ))}
            </ul>
         </div>

         <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg text-white mb-4">Pipeline Workflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
               <WorkflowStep number="01" title="Data Ingestion" desc="CSV Loading" />
               <div className="hidden md:block h-px w-12 bg-slate-600"></div>
               <WorkflowStep number="02" title="Preprocessing" desc="MinMax Scaling" />
               <div className="hidden md:block h-px w-12 bg-slate-600"></div>
               <WorkflowStep number="03" title="Sequencing" desc="Window: 24h" />
               <div className="hidden md:block h-px w-12 bg-slate-600"></div>
               <WorkflowStep number="04" title="Training" desc="GRU/LSTM/LR" />
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl backdrop-blur-sm hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{subValue}</p>
    </div>
  );
}

const WorkflowStep = ({ number, title, desc }: any) => (
  <div className="flex flex-col items-center text-center">
    <span className="text-4xl font-bold text-slate-700 mb-2">{number}</span>
    <h4 className="text-slate-200 font-semibold text-sm">{title}</h4>
    <p className="text-slate-500 text-xs">{desc}</p>
  </div>
);

export default DashboardView;