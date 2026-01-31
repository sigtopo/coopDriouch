
import React from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin, Sprout } from 'lucide-react';
import { CooperativeFeature } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  features: CooperativeFeature[];
  selectedId: any;
  onSelect: (f: CooperativeFeature) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setOpen, 
  searchTerm, 
  setSearchTerm, 
  features, 
  selectedId, 
  onSelect 
}) => {
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
          <div className="p-6 border-b border-gray-100 bg-green-800 text-white">
            <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight">
              <Sprout size={28} className="text-green-400" />
              DRIOUCH
            </h1>
            <p className="text-xs text-green-200 font-medium uppercase tracking-widest mt-1">Guide des Coopératives</p>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, secteur..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white transition shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {features.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm">
                <Search size={40} className="mb-3 opacity-10" />
                <p className="font-medium">Aucun résultat trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {features.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(f)}
                    className={`w-full text-left p-5 hover:bg-green-50 transition border-l-4 group
                      ${selectedId === f.properties.id ? 'bg-green-50 border-green-700' : 'border-transparent'}`}
                  >
                    <div className="font-extrabold text-gray-900 group-hover:text-green-800 transition-colors mb-1 text-sm">
                      {f.properties['Nom de coopérative'] || "Coopérative Sans Nom"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <MapPin size={12} className="text-green-600 shrink-0" />
                      <span className="truncate uppercase">{f.properties.Commune || "Province de Driouch"}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-100 border-t border-gray-200 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {features.length} Coopératives répertoriées
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
