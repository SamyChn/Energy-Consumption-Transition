import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';
import { fetchEnergyMix } from '../services/energyApi';
import type { EnergyMixData } from '../types/energy';

export function EnergyMixChart() {
  const [data, setData] = useState<EnergyMixData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mixData = await fetchEnergyMix();
        setData(mixData);
      } catch (error) {
        console.error('Error loading energy mix:', error);
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
  const renewablePercentage = latestData
    ? Math.round(((latestData.solar + latestData.wind + latestData.hydro + latestData.bioenergy) / latestData.total) * 100)
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
          <div className="p-3 bg-blue-100 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mix Énergétique en Temps Réel</h2>
            <p className="text-sm text-gray-500">Production par source (MW)</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">{renewablePercentage}%</div>
          <div className="text-sm text-gray-500">Renouvelable</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="nuclear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="wind" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="hydro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Area type="monotone" dataKey="nuclear" stackId="1" stroke="#8b5cf6" fill="url(#nuclear)" name="Nucléaire" />
          <Area type="monotone" dataKey="hydro" stackId="1" stroke="#3b82f6" fill="url(#hydro)" name="Hydraulique" />
          <Area type="monotone" dataKey="wind" stackId="1" stroke="#06b6d4" fill="url(#wind)" name="Éolien" />
          <Area type="monotone" dataKey="solar" stackId="1" stroke="#fbbf24" fill="url(#solar)" name="Solaire" />
          <Area type="monotone" dataKey="bioenergy" stackId="1" stroke="#10b981" fill="#10b981" name="Bioénergie" />
          <Area type="monotone" dataKey="thermal" stackId="1" stroke="#ef4444" fill="#ef4444" name="Thermique" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
