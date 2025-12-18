import { useEffect, useState } from 'react';
import { MapPin, Zap, TrendingUp } from 'lucide-react';
import { fetchRegionalData } from '../services/energyApi';
import type { RegionalData } from '../types/energy';

const REGIONS_SVG_PATHS: { [key: string]: string } = {
  'Île-de-France': 'M 280 180 L 290 175 L 295 180 L 295 190 L 290 195 L 280 195 Z',
  'Auvergne-Rhône-Alpes': 'M 320 240 L 340 235 L 355 245 L 360 260 L 350 275 L 330 280 L 315 270 L 315 250 Z',
  'Provence-Alpes-Côte d\'Azur': 'M 340 290 L 370 285 L 390 295 L 395 310 L 380 320 L 355 315 L 340 305 Z',
  'Occitanie': 'M 250 290 L 280 285 L 310 295 L 320 310 L 310 330 L 280 335 L 250 325 L 245 305 Z',
  'Nouvelle-Aquitaine': 'M 180 240 L 220 235 L 240 250 L 245 275 L 235 295 L 210 300 L 180 290 L 170 265 Z',
  'Pays de la Loire': 'M 180 200 L 210 195 L 230 205 L 235 220 L 225 235 L 200 240 L 180 230 Z',
  'Bretagne': 'M 110 190 L 145 185 L 165 195 L 170 210 L 155 225 L 125 230 L 105 215 Z',
  'Normandie': 'M 180 160 L 215 155 L 235 165 L 240 180 L 225 195 L 195 200 L 180 185 Z',
  'Hauts-de-France': 'M 240 130 L 275 125 L 295 135 L 300 150 L 285 165 L 255 170 L 240 155 Z',
  'Grand Est': 'M 310 160 L 350 155 L 375 165 L 380 185 L 365 205 L 330 210 L 310 195 Z',
  'Bourgogne-Franche-Comté': 'M 290 210 L 325 205 L 345 215 L 350 235 L 335 250 L 305 255 L 290 240 Z',
  'Centre-Val de Loire': 'M 230 210 L 265 205 L 285 215 L 290 235 L 275 250 L 245 255 L 230 240 Z',
  'Corse': 'M 420 320 L 435 315 L 445 330 L 440 350 L 425 355 L 415 340 Z'
};

const REGION_CENTERS: { [key: string]: { x: number; y: number } } = {
  'Île-de-France': { x: 287, y: 187 },
  'Auvergne-Rhône-Alpes': { x: 337, y: 257 },
  'Provence-Alpes-Côte d\'Azur': { x: 365, y: 302 },
  'Occitanie': { x: 280, y: 310 },
  'Nouvelle-Aquitaine': { x: 210, y: 267 },
  'Pays de la Loire': { x: 207, y: 217 },
  'Bretagne': { x: 135, y: 207 },
  'Normandie': { x: 207, y: 177 },
  'Hauts-de-France': { x: 267, y: 147 },
  'Grand Est': { x: 342, y: 182 },
  'Bourgogne-Franche-Comté': { x: 317, y: 232 },
  'Centre-Val de Loire': { x: 257, y: 232 },
  'Corse': { x: 430, y: 337 }
};

export default function InteractiveMap() {
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionalData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegionalData();
  }, []);

  async function loadRegionalData() {
    try {
      setLoading(true);
      const data = await fetchRegionalData();
      setRegionalData(data);
    } catch (error) {
      console.error('Error loading regional data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getRegionData(regionName: string): RegionalData | undefined {
    return regionalData.find(r => r.region === regionName);
  }

  function getRegionColor(regionName: string): string {
    const data = getRegionData(regionName);
    if (!data) return '#e5e7eb';

    const consumption = data.consumption;
    if (consumption > 8000) return '#ef4444';
    if (consumption > 6000) return '#f59e0b';
    if (consumption > 4000) return '#eab308';
    return '#22c55e';
  }

  function getRegionOpacity(regionName: string): number {
    if (hoveredRegion === null) return 0.7;
    return hoveredRegion === regionName ? 1 : 0.4;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Carte Interactive</h2>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>{'< 4000 MW'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>4000-6000 MW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>6000-8000 MW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>{'> 8000 MW'}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <svg
              viewBox="0 0 500 400"
              className="w-full h-auto"
              style={{ maxHeight: '600px' }}
            >
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>

              {Object.entries(REGIONS_SVG_PATHS).map(([regionName, path]) => (
                <g key={regionName}>
                  <path
                    d={path}
                    fill={getRegionColor(regionName)}
                    opacity={getRegionOpacity(regionName)}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{ filter: hoveredRegion === regionName ? 'url(#shadow)' : 'none' }}
                    onMouseEnter={() => setHoveredRegion(regionName)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(getRegionData(regionName) || null)}
                  />

                  {hoveredRegion === regionName && REGION_CENTERS[regionName] && (
                    <text
                      x={REGION_CENTERS[regionName].x}
                      y={REGION_CENTERS[regionName].y}
                      textAnchor="middle"
                      className="text-xs font-semibold pointer-events-none"
                      fill="#1f2937"
                    >
                      {regionName}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <p className="text-sm text-gray-600 text-center mt-4">
              Survolez une région pour voir son nom, cliquez pour voir les détails
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            {selectedRegion ? (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {selectedRegion.region}
                </h3>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">Consommation</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedRegion.consumption.toLocaleString()} MW
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Production</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedRegion.production.toLocaleString()} MW
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Bilan</span>
                    </div>
                    <p className={`text-2xl font-bold ${
                      selectedRegion.production >= selectedRegion.consumption
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}>
                      {(selectedRegion.production - selectedRegion.consumption).toLocaleString()} MW
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedRegion.production >= selectedRegion.consumption
                        ? 'Excédent de production'
                        : 'Déficit de production'}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">Mix Énergétique</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedRegion.energyMix).map(([source, value]) => {
                        const sourceLabels: { [key: string]: string } = {
                          nuclear: 'Nucléaire',
                          solar: 'Solaire',
                          wind: 'Éolien',
                          hydro: 'Hydraulique',
                          thermal: 'Thermique',
                          bioenergy: 'Bioénergie'
                        };
                        const colors: { [key: string]: string } = {
                          nuclear: 'from-yellow-400 to-yellow-500',
                          solar: 'from-orange-400 to-orange-500',
                          wind: 'from-blue-400 to-blue-500',
                          hydro: 'from-cyan-400 to-cyan-500',
                          thermal: 'from-gray-400 to-gray-500',
                          bioenergy: 'from-green-400 to-green-500'
                        };
                        return (
                          <div key={source}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{sourceLabels[source] || source}</span>
                              <span className="font-medium">{value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${colors[source]} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    Sélectionnez une région
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Cliquez sur une région de la carte pour voir ses statistiques énergétiques détaillées
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
