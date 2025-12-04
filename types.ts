export enum ModelType {
  PERSISTENCE = 'Persistence',
  LINEAR_REGRESSION = 'Linear Regression',
  KNN = 'KNN',
  GRU = 'GRU (Deep Learning)'
}

export interface WeatherFeatures {
  temperature: number; // C
  humidity: number; // %
  windSpeed: number; // km/h
  hour: number; // 0-23
  dayOfWeek: number; // 0-6
  isWeekend: number; // 0 or 1
  month: number; // 1-12
}

export interface PredictionResult {
  model: ModelType;
  predictedTemp: number;
  confidence: number;
  processingTimeMs: number;
}

export interface HistoricalDataPoint {
  index: number;
  actual: number;
  persistence: number;
  lr: number;
  knn: number;
  gru: number;
}

export interface ModelMetrics {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
}