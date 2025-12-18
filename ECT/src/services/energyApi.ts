import type { EnergyMixData, ConsumptionData, RegionalData } from '../types/energy';

const RTE_API_BASE = 'https://digital.iservices.rte-france.com/open_api';
const ODRE_API_BASE = 'https://odre.opendatasoft.com/api/explore/v2.1';

export const generateMockEnergyMix = (): EnergyMixData[] => {
  const now = new Date();
  const data: EnergyMixData[] = [];

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();

    const baseConsumption = 50000 + Math.sin(hour / 24 * Math.PI * 2) * 15000;

    data.push({
      timestamp: timestamp.toISOString(),
      nuclear: 35000 + Math.random() * 5000,
      solar: Math.max(0, Math.sin((hour - 6) / 12 * Math.PI) * 8000),
      wind: 5000 + Math.random() * 7000,
      hydro: 6000 + Math.random() * 3000,
      thermal: 3000 + Math.random() * 2000,
      bioenergy: 1500 + Math.random() * 1000,
      total: baseConsumption
    });
  }

  return data;
};

export const generateMockConsumption = (): ConsumptionData[] => {
  const now = new Date();
  const data: ConsumptionData[] = [];

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();

    const consumption = 50000 + Math.sin(hour / 24 * Math.PI * 2) * 15000 + Math.random() * 2000;
    const forecast = consumption + (Math.random() - 0.5) * 3000;

    data.push({
      timestamp: timestamp.toISOString(),
      consumption: Math.round(consumption),
      forecast: Math.round(forecast)
    });
  }

  return data;
};

export const generateMockRegionalData = (): RegionalData[] => {
  const regions = [
    'Île-de-France',
    'Auvergne-Rhône-Alpes',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Hauts-de-France',
    'Grand Est',
    'Provence-Alpes-Côte d\'Azur',
    'Pays de la Loire',
    'Bretagne',
    'Normandie',
    'Bourgogne-Franche-Comté',
    'Centre-Val de Loire',
    'Corse'
  ];

  return regions.map(region => {
    const nuclear = Math.round(Math.random() * 40);
    const solar = Math.round(Math.random() * 25);
    const wind = Math.round(Math.random() * 30);
    const hydro = Math.round(Math.random() * 20);
    const bioenergy = Math.round(Math.random() * 10);
    const thermal = Math.max(0, 100 - nuclear - solar - wind - hydro - bioenergy);

    return {
      region,
      consumption: Math.round(5000 + Math.random() * 15000),
      production: Math.round(3000 + Math.random() * 12000),
      renewable_percentage: Math.round(20 + Math.random() * 60),
      energyMix: {
        nuclear,
        solar,
        wind,
        hydro,
        thermal,
        bioenergy
      }
    };
  });
};

export const fetchEnergyMix = async (): Promise<EnergyMixData[]> => {
  return generateMockEnergyMix();
};

export const fetchConsumption = async (): Promise<ConsumptionData[]> => {
  return generateMockConsumption();
};

export const fetchRegionalData = async (): Promise<RegionalData[]> => {
  return generateMockRegionalData();
};
