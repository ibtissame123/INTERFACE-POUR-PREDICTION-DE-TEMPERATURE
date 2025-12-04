import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { generateHistoricalData, MOCK_METRICS } from '../services/mockBackend';
import { ModelType } from '../types';

const ComparisonView: React.FC = () => {
  const data = useMemo(() => generateHistoricalData(30), []);
  const metricsData = Object.entries(MOCK_METRICS).map(([name, metrics]) => ({
    name,
    ...metrics
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Model Comparison</h2>
        <p className="text-slate-400">Evaluate model performance against historical test data.</p>
      </div>

      {/* Main Chart - Predictions vs Reality */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-blue-500">
          Time Series Forecasting: Predicted vs Actual
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="index" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8' }} 
                label={{ value: 'Time Steps (Hours)', position: 'insideBottom', offset: -5, fill: '#64748b' }} 
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8' }}
                label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fill: '#64748b' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#f8fafc" 
                strokeWidth={3} 
                dot={false} 
                name="Actual Data"
              />
              <Line 
                type="monotone" 
                dataKey="gru" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false} 
                name="GRU (Deep Learning)"
              />
              <Line 
                type="monotone" 
                dataKey="lr" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false} 
                name="Linear Regression"
              />
              <Line 
                type="monotone" 
                dataKey="knn" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                strokeDasharray="3 3" 
                dot={false} 
                name="KNN"
              />
              <Line 
                type="stepAfter" 
                dataKey="persistence" 
                stroke="#ef4444" 
                strokeWidth={1} 
                strokeDasharray="3 3" 
                dot={false} 
                name="Persistence (Baseline)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RMSE Comparison */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">RMSE (Root Mean Squared Error) - Lower is better</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" hide />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                />
                <Bar dataKey="rmse" radius={[0, 4, 4, 0]} barSize={32}>
                  {metricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend for Bar Chart */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {metricsData.map((m) => (
              <div key={m.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(m.name) }}></div>
                <span className="text-xs text-slate-300">{m.name}: <span className="font-bold">{m.rmse}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* R2 Score Comparison */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">R² Score (Accuracy) - Higher is better</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={false} />
                <YAxis domain={[0, 1]} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                />
                <Bar dataKey="r2" radius={[4, 4, 0, 0]} barSize={40}>
                   {metricsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
           <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {metricsData.map((m) => (
              <div key={m.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(m.name) }}></div>
                <span className="text-xs text-slate-300">{m.name}: <span className="font-bold">{m.r2}</span></span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const getColor = (name: string) => {
  switch (name) {
    case ModelType.GRU: return '#3b82f6';
    case ModelType.LINEAR_REGRESSION: return '#10b981';
    case ModelType.KNN: return '#f59e0b';
    case ModelType.PERSISTENCE: return '#ef4444';
    default: return '#94a3b8';
  }
};

export default ComparisonView;