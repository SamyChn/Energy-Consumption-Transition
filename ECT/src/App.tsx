import { useState } from 'react';
import { Zap, BarChart3, MessageSquare, TrendingUp } from 'lucide-react';
import { EnergyMixChart } from './components/EnergyMixChart';
import { ConsumptionChart } from './components/ConsumptionChart';
import { RegionalStats } from './components/RegionalStats';
import { ChatBot } from './components/ChatBot';
import InteractiveMap from './components/InteractiveMap';

type Tab = 'overview' | 'regional' | 'chat';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EnergyTransition</h1>
                <p className="text-sm text-gray-500">Tableau de bord de la transition énergétique</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <div className="text-xs text-gray-500">Sources</div>
                <div className="text-sm font-medium text-gray-700">RTE • ENEDIS • ODRE</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('regional')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'regional'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Régions
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Assistant IA
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Consommation actuelle</div>
                    <div className="text-2xl font-bold text-gray-900">62.5 GW</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">75% de la capacité max</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Énergies renouvelables</div>
                    <div className="text-2xl font-bold text-green-600">28.4%</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '28.4%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Objectif 2030 : 40%</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Émissions CO2</div>
                    <div className="text-2xl font-bold text-orange-600">42 gCO2/kWh</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600" style={{ width: '12%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Parmi les plus bas d'Europe</div>
              </div>
            </div>

            <EnergyMixChart />
            <ConsumptionChart />
          </div>
        )}

        {activeTab === 'regional' && (
          <div className="space-y-6">
            <RegionalStats />
            <InteractiveMap />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <ChatBot />
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Configuration Ollama requise</h4>
                  <p className="text-sm text-blue-700">
                    Pour utiliser le chatbot, assurez-vous qu'Ollama est installé et en cours d'exécution avec le modèle llama3.2.
                  </p>
                  <div className="mt-2 text-xs text-blue-600 font-mono bg-white rounded px-2 py-1 inline-block">
                    ollama run llama3.2
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Projet Open Data & IA - Consommation énergétique et transition
            </div>
            <div className="flex items-center gap-4">
              <span>Données : RTE, ENEDIS, ODRE</span>
              <span>IA : Ollama</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
