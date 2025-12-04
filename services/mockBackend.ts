import { ModelType, WeatherFeatures, PredictionResult, HistoricalDataPoint, ModelMetrics } from '../types';

// Simulate scaler (MinMax) from Python code: scaler.fit_transform(data)
// These are hypothetical min/max values based on typical weather data to normalize inputs
const SCALER_PARAMS = {
  temp: { min: -10, max: 40 },
  humidity: { min: 0, max: 100 },
  wind: { min: 0, max: 100 },
};

const normalize = (val: number, min: number, max: number) => (val - min) / (max - min);
const denormalize = (val: number, min: number, max: number) => val * (max - min) + min;

// Mock Logic mimicking the Python models
export const predictTemperature = async (
  features: WeatherFeatures,
  model: ModelType
): Promise<PredictionResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 500));

  const { temperature, humidity, windSpeed, hour, month } = features;
  
  let predictedVal = 0;
  let confidence = 0.95;

  switch (model) {
    case ModelType.PERSISTENCE:
      // Logic: y_pred = last_observed_value (In this context, implies input temp stays similar)
      predictedVal = temperature; 
      confidence = 0.85;
      break;

    case ModelType.LINEAR_REGRESSION:
      // Logic: A linear combination. 
      // Higher temp -> higher next temp. 
      // Higher humidity at night -> cooler? 
      // Simplified coefficients based on typical physics.
      predictedVal = (temperature * 0.95) + (humidity * 0.02) - (windSpeed * 0.05) + (hour > 12 ? -0.5 : 0.5);
      confidence = 0.90;
      break;

    case ModelType.KNN:
      // Logic: Average of similar neighbors.
      // We simulate this by adding some random noise to a smoothed value.
      const noise = (Math.random() - 0.5) * 2; 
      predictedVal = temperature + noise; 
      confidence = 0.88;
      break;

    case ModelType.GRU:
      // Logic: Deep Learning, captures non-linear seasonal patterns.
      // Simulating a more complex function involving sin/cos for time.
      const timeFactor = Math.sin((hour / 24) * 2 * Math.PI);
      const monthFactor = Math.cos((month / 12) * 2 * Math.PI);
      predictedVal = (temperature * 0.9) + (timeFactor * 1.5) + (monthFactor * 0.5) - (windSpeed * 0.02);
      confidence = 0.98;
      break;
  }

  return {
    model,
    predictedTemp: parseFloat(predictedVal.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    processingTimeMs: Math.floor(Math.random() * 100) + 20,
  };
};

// Generate dummy historical data for the charts
export const generateHistoricalData = (points = 50): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  let currentTemp = 20;

  for (let i = 0; i < points; i++) {
    // Random walk with seasonality
    const change = (Math.random() - 0.5) * 3;
    const seasonality = Math.sin(i / 5) * 2;
    currentTemp = 20 + change + seasonality;

    // Simulate model errors based on their characteristics
    data.push({
      index: i,
      actual: parseFloat(currentTemp.toFixed(1)),
      persistence: parseFloat((currentTemp - change).toFixed(1)), // Lagged by 1 step effectively
      lr: parseFloat((currentTemp + (Math.random() - 0.5) * 1.5).toFixed(1)), // Linear error
      knn: parseFloat((currentTemp + (Math.random() - 0.5) * 2.5).toFixed(1)), // Higher variance
      gru: parseFloat((currentTemp + (Math.random() - 0.5) * 0.8).toFixed(1)), // Tightest fit
    });
  }
  return data;
};

export const MOCK_METRICS: Record<ModelType, ModelMetrics> = {
  [ModelType.PERSISTENCE]: { mse: 3.24, rmse: 1.80, mae: 1.45, r2: 0.82 },
  [ModelType.LINEAR_REGRESSION]: { mse: 2.15, rmse: 1.46, mae: 1.12, r2: 0.89 },
  [ModelType.KNN]: { mse: 2.89, rmse: 1.70, mae: 1.35, r2: 0.85 },
  [ModelType.GRU]: { mse: 1.05, rmse: 1.02, mae: 0.78, r2: 0.95 },
};