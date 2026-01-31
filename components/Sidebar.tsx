
import React from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Sprout, Filter, RotateCcw } from 'lucide-react';
import { CooperativeFeature } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  features: CooperativeFeature[];
  selectedId: any;
  onSelect: (f: CooperativeFeature) => void;
  
  // Nouveaux états de filtres
  filterCommune: string;
  setFilterCommune: (v: string) => void;
  filterGenre: string;
  setFilterGenre: (v: string) => void;
  filterSecteur: string;
  setFilterSecteur: (v: string) => void;
  filterNiveau: string;
  setFilterNiveau: (v: string) => void;
  
  options: {
    communes: string[];
    genres: string[];
    secteurs: string[];
    niveaux: string[];
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setOpen, 
  searchTerm, 
  setSearchTerm, 
  features, 
  selectedId, 
  onSelect,
  filterCommune,
  setFilterCommune,
  filterGenre,
  setFilterGenre,
  filterSecteur,
  setFilterSecteur,
  filterNiveau,
  setFilterNiveau,
  options
}) => {

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCommune("");
    setFilterGenre("");
    setFilterSecteur("");
    setFilterNiveau("");
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-[2000] shadow-xl relative
        ${isOpen ? 'w-full md:w-80' : 'w-0'}`}
    >
      <button 
        onClick={() => setOpen(!isOpen)}
        className={`absolute -right-8 top-6 p-2 bg-white border border-gray-200 rounded-r-lg shadow-md hover:bg-gray-50 text-gray-500 z-[2001]
          ${!isOpen && 'hidden md:block'}`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {isOpen && (
        <>
          <div className="p-6 border-b border-gray-100 bg-green-800 text-white shrink-0">
            <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">
              <Sprout size={28} className="text-green-400" />
              DRIOUCH
            </h1>
            <p className="text-xs text-green-200 font-medium uppercase tracking-widest mt-1">Guide des Coopératives</p>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3 shrink-0">
            {/* Recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white transition shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            {/* Grille de Filtres */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Commune</label>
                <select 
                  className="w-full p-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  value={filterCommune}
                  onChange={(e) => setFilterCommune(e.target.value)}
                >
                  <option value="">Toutes</option>
                  {options.communes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Genre</label>
                <select 
                  className="w-full p-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                >
                  <option value="">Tous</option>
                  {options.genres.map(g => <option key={g} value={g}>{g === 'M' ? 'Homme' : g === 'F' ? 'Femme' : g}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Secteur</label>
                <select 
                  className="w-full p-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  value={filterSecteur}
                  onChange={(e) => setFilterSecteur(e.target.value)}
                >
                  <option value="">Tous</option>
                  {options.secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Niveau</label>
                <select 
                  className="w-full p-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-green-500 outline-none"
                  value={filterNiveau}
                  onChange={(e) => setFilterNiveau(e.target.value)}
                >
                  <option value="">Tous</option>
                  {options.niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* Bouton Reset */}
            <button 
              onClick={resetFilters}
              className="w-full py-1.5 flex items-center justify-center gap-2 text-[10px] font-bold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <RotateCcw size={12} />
              RÉINITIALISER LES FILTRES
            </button>
          </div>

          {/* Liste des résultats */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {features.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm">
                <Filter size={40} className="mb-3 opacity-10" />
                <p className="font-medium">Aucun résultat trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {features.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(f)}
                    className={`w-full text-left p-4 hover:bg-green-50 transition border-l-4 group
                      ${selectedId === f.properties.id ? 'bg-green-50 border-green-700' : 'border-transparent'}`}
                  >
                    <div className="font-extrabold text-gray-900 group-hover:text-green-800 transition-colors mb-1 text-sm leading-snug">
                      {f.properties['Nom de coopérative'] || "Coopérative Sans Nom"}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-tight">
                      <MapPin size={10} className="text-green-600 shrink-0" />
                      <span className="truncate uppercase">{f.properties.Commune || "Province de Driouch"}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-green-700 whitespace-nowrap">{f.properties["Filière d'activité"] || "Activités"}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 border-t border-gray-200 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest shrink-0">
            {features.length} Coopératives répertoriées
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
