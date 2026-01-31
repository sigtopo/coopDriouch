
import React from 'react';
import { X, List, Phone, MapPin, User, Briefcase } from 'lucide-react';
import { CooperativeFeature } from '../types';

interface DetailPanelProps {
  coop: CooperativeFeature;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ coop, onClose }) => {
  const properties = coop.properties;

  const getFriendlyKey = (key: string) => {
    const keysMap: Record<string, string> = {
      "Nom de coopérative": "Nom de la coopérative",
      "Filière d'activité": "Secteur d'activité",
      "Province": "Province",
      "Cercle": "Cercle",
      "Commune": "Commune",
      "Douar/Quartier": "Douar / Quartier",
      "Date de création": "Date de création",
      "Nombre des adhérents": "Nombre d'adhérents",
      "Nombre des femmes": "Nombre de femmes",
      "Nombre des jeunes": "Nombre de jeunes",
      "Capital social": "Capital social",
      "Nom et prénom président/gestionnaire": "Président / Gestionnaire",
      "Genre": "Genre",
      "Date de naissance": "Date de naissance",
      "Niveau scolaire": "Niveau scolaire",
      "Tel": "Téléphone"
    };
    return keysMap[key] || key;
  };

  // Liste ordonnée des clés importantes pour l'affichage en haut du tableau
  const mainKeys = [
    "Nom et prénom président/gestionnaire",
    "Genre",
    "Tel",
    "Commune",
    "Douar/Quartier",
    "Filière d'activité"
  ];

  return (
    <div className="absolute inset-y-0 right-0 md:right-4 md:top-4 md:bottom-4 w-full md:w-96 z-[3000] p-4 flex pointer-events-none">
      <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-gray-100">
        {/* Header Simple et Élégant */}
        <div className="p-4 bg-green-700 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <List size={20} />
            <h2 className="font-bold text-lg">Fiche Technique</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-green-600 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corps du panneau */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* En-tête de la Coopérative */}
          <div className="p-6 bg-green-50 border-b border-green-100">
            <h3 className="text-xl font-bold text-green-900 leading-tight mb-2">
              {properties['Nom de coopérative'] || "Sans Nom"}
            </h3>
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <Briefcase size={14} />
              <span className="font-medium">{properties["Filière d'activité"] || "Activités Diverses"}</span>
            </div>
          </div>
          
          {/* Tableau de Données Exhaustif */}
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {Object.entries(properties).map(([key, value]) => {
                  // Filtrer uniquement les coordonnées techniques et les IDs système
                  const TechnicalKeys = ['X', 'Y', 'FID', 'id', 'objectid', 'geometry'];
                  if (!value || TechnicalKeys.some(tk => key.toLowerCase() === tk.toLowerCase())) return null;

                  return (
                    <tr key={key} className="hover:bg-gray-50 group">
                      <td className="px-6 py-3.5 font-semibold text-gray-500 w-1/2 bg-gray-50/50">
                        {getFriendlyKey(key)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-900 font-bold">
                        {key === "Tel" ? (
                          <a href={`tel:${value}`} className="text-green-700 hover:underline flex items-center gap-2">
                            <Phone size={14} />
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
        </div>

        {/* Footer de fermeture */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
           <button 
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition shadow-sm"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
