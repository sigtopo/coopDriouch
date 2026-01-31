
import React, { useState } from 'react';
import { X, Table, Info, Sparkles, Share2, Printer } from 'lucide-react';
import { CooperativeFeature } from '../types';
import { GoogleGenAI } from '@google/genai';

interface DetailPanelProps {
  coop: CooperativeFeature;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ coop, onClose }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const properties = coop.properties;

  const handleAiAnalyze = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Basé sur les données suivantes d'une coopérative dans la province de Driouch, Maroc :
        ${JSON.stringify(properties)}
        Veuillez fournir un résumé exécutif professionnel (3 paragraphes) comprenant :
        1. La nature de l'activité de la coopérative.
        2. L'impact socio-économique potentiel dans la région.
        3. Des recommandations pour améliorer ses performances ou son marketing.
        Utilisez un ton formel et encourageant. Répondez en français.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setAiInsight(response.text || "Aucune analyse disponible pour le moment.");
    } catch (err) {
      setAiInsight("Désolé, une erreur s'est produite lors de la connexion à l'IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  const getFriendlyKey = (key: string) => {
    // These keys mostly match the French headers provided in the original database image
    const keysMap: Record<string, string> = {
      "Nom de coopérative": "Nom de la coopérative",
      "Nom_Coop": "Nom de la coopérative",
      "Filière d'activité": "Secteur d'activité",
      "Secteur": "Secteur",
      "Province": "Province",
      "Cercle": "Cercle",
      "Commune": "Commune",
      "Douar/Quartier": "Douar / Quartier",
      "Date de création": "Date de création",
      "Nombre des adhérents": "Nombre d'adhérents",
      "Nombre des femmes": "Nombre de femmes",
      "Nombre des jeunes": "Nombre de jeunes",
      "Capital social": "Capital social",
      "Prénom président/gest": "Prénom du président/gestionnaire",
      "Genre": "Genre",
      "Date de naissance": "Date de naissance",
      "Niveau scolaire": "Niveau scolaire",
      "Tel": "Téléphone",
      "Email": "E-mail",
      "Addresse": "Adresse"
    };
    return keysMap[key] || key;
  };

  return (
    <div className="absolute inset-y-0 right-0 md:right-4 md:top-4 md:bottom-4 w-full md:w-1/3 max-w-lg z-[3000] p-4 flex pointer-events-none">
      <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-gray-100">
        {/* Header */}
        <div className="p-4 bg-green-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Info size={20} />
            <h2 className="font-bold text-lg truncate">Détails de la coopérative</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-green-500 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
              {properties['Nom de coopérative'] || properties.Nom_Coop || "Coopérative Sans Nom"}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {properties["Filière d'activité"] || properties.Secteur || "Général"}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {properties.Commune || "Driouch"}
              </span>
            </div>
          </div>

          {/* Data Table */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
              <Table size={18} />
              <span>Tableau des informations</span>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(properties).map(([key, value]) => {
                    if (!value || key.toLowerCase().includes('id') || key.toLowerCase().includes('objectid') || key === 'X' || key === 'Y') return null;
                    return (
                      <tr key={key} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-600 w-2/5">
                          {getFriendlyKey(key)}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {String(value)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <Sparkles size={18} />
                <span>Analyse IA (Gemini)</span>
              </div>
            </div>
            
            {aiInsight ? (
              <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line animate-in fade-in slide-in-from-bottom-2">
                {aiInsight}
                <button 
                  onClick={() => setAiInsight(null)}
                  className="mt-4 text-indigo-600 text-xs font-bold hover:underline"
                >
                  Fermer l'analyse
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-indigo-600 text-sm mb-4">Obtenez une analyse approfondie et des recommandations personnalisées pour cette coopérative.</p>
                <button 
                  onClick={handleAiAnalyze}
                  disabled={loadingAi}
                  className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAi ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Générer une analyse intelligente
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 shrink-0">
          <button className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-sm">
            <Share2 size={16} />
            Partager
          </button>
          <button 
            onClick={() => window.print()}
            className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-sm"
          >
            <Printer size={16} />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
