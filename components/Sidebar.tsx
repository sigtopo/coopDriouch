
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
        ${isOpen ? 'w-full md:w-96' : 'w-0'}`}
    >
      {/* Toggle Button on the RIGHT of the sidebar */}
      <button 
        onClick={() => setOpen(!isOpen)}
        className={`absolute -right-10 top-4 p-2 bg-white border border-gray-200 rounded-r-lg shadow-md hover:bg-gray-50 text-gray-600 transition-opacity z-[2001]
          ${!isOpen && 'hidden md:block'}`}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {isOpen && (
        <>
          <div className="p-6 border-b border-gray-100 bg-green-700 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Sprout size={28} />
              Driouch Coops
            </h1>
            <p className="text-green-100 text-sm mt-1 opacity-90">Guide des coopératives locales</p>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une coopérative..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {features.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Aucun résultat trouvé</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {features.map((f, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(f)}
                    className={`w-full text-left p-4 hover:bg-green-50 transition flex flex-col gap-1 border-l-4 
                      ${selectedId === f.properties.id ? 'bg-green-50 border-green-600' : 'border-transparent'}`}
                  >
                    <span className="font-bold text-gray-800 text-lg">
                      {f.properties['Nom de coopérative'] || f.properties.Nom_Coop || "Coopérative Sans Nom"}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="text-green-600" />
                      <span>{f.properties.Commune || f.properties.PROVINCE || "Province de Driouch"}</span>
                    </div>
                    {(f.properties["Filière d'activité"] || f.properties.Secteur) && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs w-fit font-medium">
                        {f.properties["Filière d'activité"] || f.properties.Secteur}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
            {features.length} coopératives trouvées
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
