
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
import { CooperativeFeature } from '../types.ts';

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
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const p = selectedCoop?.properties;

  const suggestions = useMemo(() => {
    if (!localSearch || localSearch.length < 2) return [];
    const term = localSearch.toLowerCase();
    return allCoops.filter(f => {
      const name = (f.properties['Nom de coopérative'] || f.properties.Nom_Coop || "").toLowerCase();
      const president = (f.properties['Nom et prénom président/gestionnaire'] || "").toLowerCase();
      return name.includes(term) || president.includes(term);
    }).slice(0, 6);
  }, [localSearch, allCoops]);

  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition({
        x: initialPos.current.x + dx,
        y: initialPos.current.y + dy
      });
    };
    const onMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (selectedCoop) {
      setIsSearchOpen(false);
      setShowSuggestions(false);
      setIsExpanded(true); 
    }
  }, [selectedCoop]);

  const coords = selectedCoop?.geometry?.coordinates;
  const lng = Array.isArray(coords) ? coords[0] : 0;
  const lat = Array.isArray(coords) ? coords[1] : 0;
  const gMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const formatGenre = (g: string) => {
    if (g === 'M') return 'Homme (ذكر)';
    if (g === 'F') return 'Femme (أنثى)';
    return g || 'N/A';
  };

  const closeEverything = () => {
    setIsSearchOpen(false);
    onClose();
    setIsExpanded(false);
    setLocalSearch("");
  };

  if (!selectedCoop && !isSearchOpen) {
    return (
      <div 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[4000] pointer-events-auto"
        style={{ transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)` }}
        onMouseDown={onMouseDown}
      >
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl hover:bg-green-700 hover:scale-110 transition-all flex items-center justify-center border-4 border-white"
        >
          <Search size={24} strokeWidth={3} />
        </button>
      </div>
    );
  }

  const coopName = p?.['Nom de coopérative'] || p?.Nom_Coop;
  const commune = p?.Commune || "---";
  const sector = p?.["Filière d'activité"] || p?.Secteur || "---";
  const douar = p?.['Douar/Quartier'] || p?.Quartier || "---";
  const dateCreation = p?.['Date de création'] || "---";
  const president = p?.['Nom et prénom président/gestionnaire'] || "Non renseigné";
  const phone = p?.['N° téléphone'] || p?.['Téléphone'] || p?.['Telephone'] || p?.['Tel'] || null;
  const birthDate = p?.['Date de naissance'] || "---";
  const schoolLevel = p?.['Niveau scolaire'] || "---";
  
  const adherents = p?.["Nombre des adherents"] || p?.["Nombre des adhérents"] || 0;
  const capital = p?.["Capital social"] || "0";
  const femmes = p?.["Nombre des femmes"] || 0;
  const jeunes = p?.["Nombre des jeunes"] || p?.["Jeunes (-35 ans)"] || 0;

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-[4000] flex justify-center p-0 md:p-4 pointer-events-none transition-all duration-500 ${isExpanded ? 'h-[90vh]' : 'h-auto'}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div 
        className={`bg-white w-full max-w-2xl shadow-2xl pointer-events-auto transition-all flex flex-col border border-slate-200
          ${isExpanded ? 'rounded-t-[2.5rem] h-full' : 'rounded-t-[2.5rem] h-auto mb-0 md:mb-2 md:rounded-[2.5rem]'} ${isDragging ? 'duration-0 scale-[1.01]' : ''}`}
      >
        <div className="flex flex-col items-center py-3 cursor-grab active:cursor-grabbing shrink-0" onMouseDown={onMouseDown}>
          <div className="w-14 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              {isSearchOpen ? (
                <div className="relative mt-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher une coopérative..."
                    className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all"
                    value={localSearch}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  <Search className="absolute left-4 top-3.5 text-green-600" size={20} />
                </div>
              ) : selectedCoop ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                       <Building2 size={24} />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight uppercase text-wrap">
                      {coopName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 pl-12 flex-wrap">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      {commune}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-wide">
                      {sector}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 mt-1 shrink-0">
              {selectedCoop && !isSearchOpen && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-2.5 rounded-full transition-all border shadow-sm ${isExpanded ? 'bg-orange-600 text-white border-orange-700' : 'bg-orange-50 text-orange-600 border-orange-200'}`}
                >
                  {isExpanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
                </button>
              )}
              <button onClick={closeEverything} className="p-2.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200 hover:bg-slate-200 shadow-sm"><X size={22} /></button>
            </div>
          </div>
        </div>

        {selectedCoop && (
          <div className={`overflow-y-auto custom-scrollbar px-6 pb-10 space-y-8 transition-all duration-500 ${isExpanded ? 'opacity-100 flex-1' : 'h-0 opacity-0 pointer-events-none'}`}>
            
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Globe size={16} className="text-green-600" />
                <span>Identification Administrative</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Commune</label>
                  <p className="text-sm font-black text-slate-800">{commune}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Douar / Quartier</label>
                  <p className="text-sm font-black text-slate-800">{douar}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Filière</label>
                  <p className="text-sm font-black text-slate-800 uppercase">{sector}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Date Création</label>
                  <p className="text-sm font-black text-slate-800">{dateCreation}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <User size={16} className="text-green-600" />
                <span>Profil du Dirigeant</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                <div>
                  <h4 className="text-lg font-black text-slate-800">{president}</h4>
                  {phone && (
                    <div className="flex items-center gap-2 mt-2 text-blue-600 font-bold">
                      <Phone size={18} className="fill-blue-600/10" />
                      <span className="text-base tracking-wide">{phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="h-px bg-slate-100"></div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center text-center">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5">Genre</label>
                    <p className="text-[11px] font-bold text-slate-700">{formatGenre(p?.Genre)}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center text-center">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5">Naissance</label>
                    <p className="text-[11px] font-bold text-slate-700">{birthDate}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center text-center">
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-1.5">Scolarité</label>
                    <p className="text-[11px] font-bold text-slate-700">{schoolLevel}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Indicateurs de Performance</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0fdf4] p-5 rounded-[1.5rem] border border-[#dcfce7] flex flex-col">
                  <span className="text-[10px] font-black text-[#15803d] uppercase mb-2">Total Adhérents</span>
                  <span className="text-3xl font-black text-slate-800 leading-none">{adherents}</span>
                </div>
                <div className="bg-[#eff6ff] p-5 rounded-[1.5rem] border border-[#dbeafe] flex flex-col">
                  <span className="text-[10px] font-black text-[#1d4ed8] uppercase mb-2">Capital Social</span>
                  <div className="flex items-end gap-1.5">
                    <span className="text-2xl font-black text-slate-800 leading-none">{capital}</span>
                    <span className="text-[11px] font-black text-[#1d4ed8]/60 mb-0.5">DH</span>
                  </div>
                </div>
                <div className="bg-[#fdf2f8] p-5 rounded-[1.5rem] border border-[#fce7f3] flex flex-col">
                  <span className="text-[10px] font-black text-[#be185d] uppercase mb-2">Femmes</span>
                  <span className="text-3xl font-black text-slate-800 leading-none">{femmes}</span>
                </div>
                <div className="bg-[#fff7ed] p-5 rounded-[1.5rem] border border-[#ffedd5] flex flex-col">
                  <span className="text-[10px] font-black text-[#c2410c] uppercase mb-2">Jeunes (-35 ans)</span>
                  <span className="text-3xl font-black text-slate-800 leading-none">{jeunes}</span>
                </div>
              </div>
            </section>

            <div className="flex justify-center pt-4">
              <a 
                href={gMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-black hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Map size={18} /> LOCALISER SUR GOOGLE MAPS
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
