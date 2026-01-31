
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Sparkles, Loader2, BrainCircuit, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { CooperativeFeature } from '../types.ts';

interface AIInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  data: CooperativeFeature[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ isOpen, onClose, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare compact data for analysis
      const stats = data.map(f => ({
        n: f.properties['Nom de coopérative'] || f.properties.Nom_Coop,
        c: f.properties.Commune,
        s: f.properties["Filière d'activité"],
        a: f.properties["Nombre des adherents"] || f.properties["Nombre des adhérents"] || 0,
        f: f.properties["Nombre des femmes"] || 0,
        j: f.properties["Nombre des jeunes"] || 0
      })).slice(0, 50); // Limit context window

      const prompt = `En tant qu'expert en développement rural et économie sociale, analyse ces données de ${data.length} coopératives dans la province de Driouch, Maroc. 
      Données (échantillon): ${JSON.stringify(stats)}
      
      Fournis une réponse structurée en Markdown avec:
      1. Résumé des forces (Filières dominantes, inclusion des femmes/jeunes).
      2. Défis potentiels (Concentration géographique, petite taille des groupes).
      3. Recommandations stratégiques pour Agri Invest Development.
      
      Réponds en Français avec un ton professionnel et encourageant.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Impossible de générer l'analyse.");
    } catch (err: any) {
      console.error("AI Error:", err);
      setError("Erreur de connexion avec l'IA. Vérifiez votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !insight && !loading) {
      generateInsights();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-indigo-100">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-700 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Analyse Intelligente</h2>
              <p className="text-xs text-blue-100 font-medium opacity-80">Généré par Gemini AI Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-600 gap-4">
              <Loader2 className="w-12 h-12 animate-spin opacity-40" />
              <div className="text-center">
                <p className="font-bold animate-pulse">Exploration des données...</p>
                <p className="text-xs text-slate-500 mt-1">L'IA examine les spécificités de Driouch</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-red-500 text-center px-4">
              <AlertTriangle size={48} className="mb-4 opacity-20" />
              <p className="font-bold">{error}</p>
              <button 
                onClick={generateInsights}
                className="mt-4 px-6 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="prose prose-sm prose-indigo max-w-none prose-headings:text-indigo-900 prose-headings:font-black prose-p:text-slate-700">
              <div className="whitespace-pre-wrap leading-relaxed">
                {insight}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Sparkles size={12} className="text-indigo-500" />
            <span>Provincial Analysis v2.5</span>
          </div>
          <button 
            onClick={generateInsights}
            disabled={loading}
            className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
          >
            Actualiser l'analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
