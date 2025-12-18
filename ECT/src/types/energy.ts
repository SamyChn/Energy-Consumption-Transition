export interface EnergyMixData {
  timestamp: string;
  nuclear: number;
  solar: number;
  wind: number;
  hydro: number;
  thermal: number;
  bioenergy: number;
  total: number;
}

export interface ConsumptionData {
  timestamp: string;
  consumption: number;
  forecast?: number;
}

export interface RegionalData {
  region: string;
  consumption: number;
  production: number;
  renewable_percentage: number;
  energyMix: {
    nuclear: number;
    solar: number;
    wind: number;
    hydro: number;
    thermal: number;
    bioenergy: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
