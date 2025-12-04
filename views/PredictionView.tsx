import React, { useState } from 'react';
import { ModelType, WeatherFeatures, PredictionResult } from '../types';
import { predictTemperature } from '../services/mockBackend';
import { Thermometer, Wind, Droplets, Calendar, Clock, ArrowRight, Loader2, Info, Activity } from 'lucide-react';

const PredictionView: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GRU);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const [features, setFeatures] = useState<WeatherFeatures>({
    temperature: 20,
    humidity: 50,
    windSpeed: 10,
    hour: 12,
    dayOfWeek: 2,
    isWeekend: 0,
    month: 6,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await predictTemperature(features, selectedModel);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Real-time Forecast</h2>
        <p className="text-slate-400">Enter current parameters to predict the temperature for the next hour (T+1).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 md:p-8 backdrop-blur-sm">
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Inference Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.values(ModelType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedModel(type)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                      selectedModel === type
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-700/50 my-6"></div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                label="Current Temperature (°C)" 
                icon={Thermometer} 
                name="temperature" 
                value={features.temperature} 
                onChange={handleChange} 
                min="-50" max="60"
              />
              <InputGroup 
                label="Humidity (%)" 
                icon={Droplets} 
                name="humidity" 
                value={features.humidity} 
                onChange={handleChange} 
                min="0" max="100"
              />
              <InputGroup 
                label="Wind Speed (km/h)" 
                icon={Wind} 
                name="windSpeed" 
                value={features.windSpeed} 
                onChange={handleChange} 
                min="0" max="200"
              />
              <InputGroup 
                label="Hour of Day (0-23)" 
                icon={Clock} 
                name="hour" 
                value={features.hour} 
                onChange={handleChange} 
                min="0" max="23"
              />
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Month</label>
                <select 
                  name="month"
                  value={features.month}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Month {m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekend?</label>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => setFeatures(f => ({ ...f, isWeekend: 0 }))}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${features.isWeekend === 0 ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  >
                    No
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFeatures(f => ({ ...f, isWeekend: 1 }))}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${features.isWeekend === 1 ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Run Prediction <ArrowRight size={20} /></>}
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 h-full flex flex-col backdrop-blur-sm relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Prediction Results
            </h3>

            {result ? (
              <div className="flex-1 flex flex-col justify-center items-center space-y-8 animate-fade-in-up">
                <div className="text-center space-y-2">
                  <p className="text-slate-400 text-sm uppercase tracking-wide">Predicted Temperature (T+1)</p>
                  <div className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                    {result.predictedTemp}°C
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    result.predictedTemp > features.temperature 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                  }`}>
                    {result.predictedTemp > features.temperature ? 'Trending Up' : 'Trending Down'}
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Model Confidence</span>
                      <span className="text-white font-mono">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Inference Time</span>
                    <span className="text-white font-mono">{result.processingTimeMs} ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center">
                  <Info size={32} opacity={0.5} />
                </div>
                <p className="text-center text-sm max-w-[200px]">
                  Fill the parameters and click "Run Prediction" to see the AI output.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  icon: React.ElementType;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: string;
  max: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, icon: Icon, name, value, onChange, min, max }) => (
  <div className="space-y-2">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
      <Icon size={14} /> {label}
    </label>
    <input 
      type="number" 
      name={name}
      value={value} 
      onChange={onChange}
      min={min}
      max={max}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono"
    />
  </div>
);

export default PredictionView;