import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';
import { fetchRegionalData } from '../services/energyApi';
import type { RegionalData } from '../types/energy';

export function RegionalStats() {
  const [data, setData] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'consumption' | 'renewable'>('renewable');

  useEffect(() => {
    const loadData = async () => {
      try {
        const regionalData = await fetchRegionalData();
        setData(regionalData);
      } catch (error) {
        console.error('Error loading regional data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'renewable') {
      return b.renewable_percentage - a.renewable_percentage;
    }
    return b.consumption - a.consumption;
  });

  const topRegions = sortedData.slice(0, 6);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Statistiques Régionales</h2>
            <p className="text-sm text-gray-500">Top 6 régions</p>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'consumption' | 'renewable')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="renewable">Par % Renouvelable</option>
          <option value="consumption">Par Consommation</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={topRegions} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            dataKey="region"
            type="category"
            width={150}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number, name: string) => {
              if (name === 'Consommation' || name === 'Production') {
                return [`${value.toFixed(0)} MW`, name];
              }
              return [`${value}%`, name];
            }}
          />
          <Legend />
          <Bar dataKey="consumption" fill="#f97316" name="Consommation" />
          <Bar dataKey="production" fill="#3b82f6" name="Production" />
          <Bar dataKey="renewable_percentage" fill="#10b981" name="% Renouvelable" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {topRegions.slice(0, 4).map((region) => (
          <div key={region.region} className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-1">{region.region}</div>
            <div className="text-2xl font-bold text-green-600">{region.renewable_percentage}%</div>
            <div className="text-xs text-gray-400 mt-1">Énergies vertes</div>
          </div>
        ))}
      </div>
    </div>
  );
}
