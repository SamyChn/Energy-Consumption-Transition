import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { fetchConsumption } from '../services/energyApi';
import type { ConsumptionData } from '../types/energy';

export function ConsumptionChart() {
  const [data, setData] = useState<ConsumptionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const consumptionData = await fetchConsumption();
        setData(consumptionData);
      } catch (error) {
        console.error('Error loading consumption:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  const variation = latestData && previousData
    ? ((latestData.consumption - previousData.consumption) / previousData.consumption * 100)
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Activity className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Consommation Électrique</h2>
            <p className="text-sm text-gray-500">Évolution sur 24h (MW)</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {latestData ? (latestData.consumption / 1000).toFixed(1) : '0'}k
          </div>
          <div className={`text-sm font-medium ${variation >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            labelFormatter={(label) => new Date(label).toLocaleString('fr-FR')}
            formatter={(value: number) => [`${value.toFixed(0)} MW`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="Consommation réelle"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Prévision"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
