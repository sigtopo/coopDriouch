
import React from 'react';
import { X, List, Phone, Briefcase } from 'lucide-react';
import { CooperativeFeature } from '../types';

interface DetailPanelProps {
  coop: CooperativeFeature;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ coop, onClose }) => {
  const properties = coop.properties;

  const getFriendlyKey = (key: string) => {
    const keysMap: Record<string, string> = {
      "Nom de coopérative": "Nom",
      "Filière d'activité": "Secteur",
      "Province": "Province",
      "Cercle": "Cercle",
      "Commune": "Commune",
      "Douar/Quartier": "Douar / Quartier",
      "Date de création": "Création",
      "Nombre des adhérents": "Adhérents",
      "Nombre des femmes": "Femmes",
      "Nombre des jeunes": "Jeunes",
      "Capital social": "Capital",
      "Nom et prénom président/gestionnaire": "Responsable",
      "Genre": "Genre",
      "Date de naissance": "Date de Naiss.",
      "Niveau scolaire": "Scolarité",
      "Tel": "Tél"
    };
    return keysMap[key] || key;
  };

  return (
    <div className="absolute bottom-0 md:inset-y-0 right-0 md:right-4 md:top-4 md:bottom-4 w-full md:w-80 lg:w-96 z-[3000] p-2 md:p-0 flex pointer-events-none">
      <div className="bg-white w-full h-[60vh] md:h-full rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-gray-100 ring-1 ring-black/5 animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
        
        {/* Handle for mobile */}
        <div className="md:hidden flex justify-center p-2 shrink-0">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        {/* Header Compact */}
        <div className="px-4 py-3 bg-green-700 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <List size={18} />
            <h2 className="font-bold text-sm uppercase tracking-wide">Fiche Coopérative</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-green-600 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps du panneau */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* En-tête rapide */}
          <div className="p-4 bg-green-50 border-b border-green-100">
            <h3 className="text-lg font-black text-green-900 leading-tight mb-1">
              {properties['Nom de coopérative'] || "Coopérative"}
            </h3>
            <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
              <Briefcase size={12} />
              <span>{properties["Filière d'activité"] || "Activités"}</span>
            </div>
          </div>
          
          {/* Tableau ultra-compact */}
          <table className="w-full text-[11px] md:text-xs">
            <tbody className="divide-y divide-gray-50">
              {Object.entries(properties).map(([key, value]) => {
                const TechnicalKeys = ['X', 'Y', 'FID', 'id', 'objectid', 'geometry', 'Nom_Coop'];
                if (!value || TechnicalKeys.some(tk => key.toLowerCase() === tk.toLowerCase())) return null;

                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-400 w-1/3 border-r border-gray-50/50 bg-gray-50/20">
                      {getFriendlyKey(key)}
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-bold break-words">
                      {key === "Tel" ? (
                        <a href={`tel:${value}`} className="text-green-600 flex items-center gap-1.5">
                          <Phone size={10} />
                          {String(value)}
                        </a>
                      ) : (
                        String(value)
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer simple */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 hidden md:block">
           <button 
            onClick={onClose}
            className="w-full py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
