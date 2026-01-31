
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, 
  Search,
  Phone, 
  User, 
  Building2,
  Map,
  ChevronUp,
  ChevronDown,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { CooperativeFeature } from '../types';

interface DetailPanelProps {
  selectedCoop: CooperativeFeature | null;
  allCoops: CooperativeFeature[];
  onSelect: (f: CooperativeFeature) => void;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedCoop, allCoops, onSelect, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const p = selectedCoop?.properties;

  // Autocomplete Logic
  const suggestions = useMemo(() => {
    if (!localSearch || localSearch.length < 2) return [];
    const term = localSearch.toLowerCase();
    return allCoops.filter(f => {
      const name = (f.properties['Nom de coopérative'] || f.properties.Nom_Coop || "").toLowerCase();
      const president = (f.properties['Nom et prénom président/gestionnaire'] || "").toLowerCase();
      return name.includes(term) || president.includes(term);
    }).slice(0, 6);
  }, [localSearch, allCoops]);

  // Handle outside click for suggestions and search bar closure
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // We don't automatically close the search bar here to allow typing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [lng, lat] = selectedCoop?.geometry.coordinates || [0, 0];
  const gMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const formatGenre = (g: string) => {
    if (g === 'M') return 'Homme (ذكر)';
    if (g === 'F') return 'Femme (أنثى)';
    return g || 'N/A';
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Small delay to focus if we were adding a ref, but keeping it simple
      setShowSuggestions(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-[4000] flex justify-center p-0 md:p-4 pointer-events-none transition-all duration-500 ease-in-out ${isExpanded ? 'h-[85vh]' : 'h-auto'}`}
    >
      <div 
        className={`bg-white w-full max-w-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pointer-events-auto transition-all duration-500 flex flex-col border border-slate-200/60
          ${isExpanded ? 'rounded-t-3xl h-full' : 'rounded-t-[2rem] h-auto mb-0 md:mb-2 md:rounded-2xl'}`}
      >
        {/* Drag Handle Area */}
        <div 
          className="flex flex-col items-center py-2 cursor-pointer shrink-0"
          onClick={() => selectedCoop && setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
        </div>

        {/* --- Header Area (Toggleable Search + Selection Title) --- */}
        <div className="px-5 pb-4 space-y-3">
          
          <div className="flex justify-between items-center gap-3">
            {/* Left Side: Title or Search Field */}
            <div className="flex-1 min-w-0">
              {isSearchOpen ? (
                <div className="relative animate-in slide-in-from-left-2 duration-200">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher une coopérative..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium text-slate-700"
                    value={localSearch}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  <Search className="absolute left-3 top-2.5 text-green-600" size={16} />
                </div>
              ) : selectedCoop ? (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Building2 size={16} className="text-green-600 shrink-0" />
                    <h3 className="text-[15px] font-semibold text-slate-800 truncate leading-tight">
                      {p?.['Nom de coopérative'] || p?.Nom_Coop}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      {p?.Commune}
                    </span>
                    <span className="truncate opacity-70 italic">{p?.["Filière d'activité"]}</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-sm font-medium italic animate-in fade-in">
                  Sélectionnez une coopérative sur la carte...
                </div>
              )}
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Toggle Icon */}
              <button 
                onClick={toggleSearch}
                className={`p-2 rounded-full transition-all duration-200 border ${isSearchOpen ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}
                title={isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
              >
                {isSearchOpen ? <X size={18} /> : <Search size={18} />}
              </button>

              {selectedCoop && (
                <>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-2 rounded-full transition-all duration-300 border ${isExpanded ? 'bg-orange-600 text-white border-orange-700' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'}`}
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  </button>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors border border-transparent hover:border-red-100">
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown - Positioned relative to the header */}
          {isSearchOpen && showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full mb-2 left-5 right-5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-[5000] pointer-events-auto">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(s);
                    setLocalSearch("");
                    setShowSuggestions(false);
                    setIsSearchOpen(false);
                    setIsExpanded(false);
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 flex flex-col border-b border-slate-50 last:border-0 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {s.properties['Nom de coopérative'] || s.properties.Nom_Coop}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-green-700 font-bold uppercase tracking-tighter bg-green-50 px-1 rounded">
                      {s.properties.Commune}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate italic">
                      Pres: {s.properties["Nom et prénom président/gestionnaire"] || "---"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Content Area (Full Details) --- */}
        {selectedCoop && (
          <div className={`overflow-y-auto custom-scrollbar px-5 pb-6 space-y-5 transition-all duration-500 ${isExpanded ? 'opacity-100 flex-1' : 'h-0 opacity-0 pointer-events-none'}`}>
            
            {/* Localize Action Only */}
            <div className="flex justify-center">
              <a href={gMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                <Map size={14} /> Localiser sur Google Maps
              </a>
            </div>

            {/* Section: Admin */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <Globe size={12} className="text-green-600" />
                <span>Identification Administrative</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div>
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Commune</label>
                  <p className="text-xs font-medium text-slate-700">{p?.Commune || "---"}</p>
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Douar / Quartier</label>
                  <p className="text-xs font-medium text-slate-700 truncate">{p?.["Douar/Quartier"] || "---"}</p>
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Filière</label>
                  <p className="text-xs font-medium text-slate-700">{p?.["Filière d'activité"] || "---"}</p>
                </div>
                <div>
                  <label className="text-[8px] font-bold text-slate-400 uppercase">Date Création</label>
                  <p className="text-xs font-medium text-slate-700">{p?.["Date de création"] || "---"}</p>
                </div>
              </div>
            </section>

            {/* Section: Responsable */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <User size={12} className="text-green-600" />
                <span>Profil du Dirigeant</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="mb-3 border-b border-slate-50 pb-2">
                   <p className="text-[14px] font-bold text-slate-800">
                    {p?.["Nom et prénom président/gestionnaire"] || "Non spécifié"}
                  </p>
                  {p?.Tel && (
                    <a href={`tel:${p.Tel}`} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 mt-1 transition-colors">
                      <Phone size={12} className="shrink-0" /> {p.Tel}
                    </a>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Genre</span>
                    <span className="text-[10px] text-slate-600 font-medium">{formatGenre(p?.Genre || "")}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Naissance</span>
                    <span className="text-[10px] text-slate-600 font-medium">{p?.["Date de naissance"] || "---"}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Scolarité</span>
                    <span className="text-[10px] text-slate-600 font-medium truncate">{p?.["Niveau scolaire"] || "---"}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Indicators */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-green-600" />
                <span>Performance & Chiffres</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50 flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Total Adhérents</span>
                  <div className="flex items-end gap-1">
                    <span className="text-lg font-bold text-slate-800 leading-none">{p?.["Nombre des adherents"] || p?.["Nombre des adhérents"] || 0}</span>
                    <span className="text-[9px] font-medium text-slate-400">personnes</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/50 flex flex-col">
                  <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Capital Social</span>
                  <div className="flex items-end gap-1">
                    <span className="text-base font-bold text-slate-800 leading-none truncate">{p?.["Capital social"] || "0.00"}</span>
                    <span className="text-[9px] font-medium text-slate-400">DH</span>
                  </div>
                </div>
                <div className="bg-pink-50/30 p-3 rounded-lg border border-pink-100/50 flex flex-col">
                  <span className="text-[8px] font-bold text-pink-400 uppercase mb-1">Femmes Adhérentes</span>
                  <span className="text-lg font-bold text-pink-700 leading-none">{p?.["Nombre des femmes"] || 0}</span>
                </div>
                <div className="bg-orange-50/30 p-3 rounded-lg border border-orange-100/50 flex flex-col">
                  <span className="text-[8px] font-bold text-orange-400 uppercase mb-1">Jeunes ( -35 ans)</span>
                  <span className="text-lg font-bold text-orange-700 leading-none">{p?.["Nombre des jeunes"] || 0}</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
