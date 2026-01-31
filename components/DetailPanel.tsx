
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
          <Search size={24} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  const adherents = p?.["Nombre des adherents"] || p?.["Nombre des adhérents"] || 0;

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-[4000] flex justify-center p-0 md:p-4 pointer-events-none transition-all duration-500 ${isExpanded ? 'h-[85vh]' : 'h-auto'}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div 
        className={`bg-white w-full max-w-2xl shadow-2xl pointer-events-auto transition-all flex flex-col border border-slate-200
          ${isExpanded ? 'rounded-t-3xl h-full' : 'rounded-t-[2rem] h-auto mb-0 md:mb-2 md:rounded-2xl'} ${isDragging ? 'duration-0 scale-[1.01]' : ''}`}
      >
        <div 
          className="flex flex-col items-center py-2 cursor-grab active:cursor-grabbing shrink-0"
          onMouseDown={onMouseDown}
        >
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div>

        <div className="px-5 pb-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex-1 min-w-0">
              {isSearchOpen ? (
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher une coopérative..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20"
                    value={localSearch}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setShowSuggestions(true);
                    }}
                  />
                  <Search className="absolute left-3.5 top-3 text-green-600" size={18} />
                </div>
              ) : selectedCoop ? (
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Building2 size={16} className="text-green-600 shrink-0" />
                    <h3 className="text-[15px] font-bold text-slate-800 truncate leading-tight uppercase">
                      {p?.['Nom de coopérative'] || p?.Nom_Coop}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      {p?.Commune}
                    </span>
                    <span className="truncate opacity-70 italic font-medium">{p?.["Filière d'activité"]}</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedCoop && !isSearchOpen && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`p-2 rounded-full transition-all border ${isExpanded ? 'bg-orange-600 text-white border-orange-700' : 'bg-orange-50 text-orange-600 border-orange-200'}`}
                >
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
              )}
              <button onClick={closeEverything} className="p-2 bg-slate-100 text-slate-500 rounded-full border border-slate-200"><X size={20} /></button>
            </div>
          </div>

          {isSearchOpen && showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full mb-3 left-5 right-5 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[5000] pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelect(s);
                    setLocalSearch("");
                    setShowSuggestions(false);
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left p-4 hover:bg-green-50/50 flex flex-col border-b border-slate-50 last:border-0"
                >
                  <span className="text-sm font-bold text-slate-800 truncate uppercase">
                    {s.properties['Nom de coopérative'] || s.properties.Nom_Coop}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-green-700 font-black uppercase bg-green-50 px-1.5 rounded-md border border-green-100">
                      {s.properties.Commune}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCoop && (
          <div className={`overflow-y-auto custom-scrollbar px-5 pb-6 space-y-5 transition-all duration-500 ${isExpanded ? 'opacity-100 flex-1' : 'h-0 opacity-0 pointer-events-none'}`}>
            <div className="flex justify-center pt-2">
              <a href={gMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 active:scale-95 transition-all">
                <Map size={14} /> Localiser sur Google Maps
              </a>
            </div>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Globe size={12} className="text-green-600" />
                <span>Identification Administrative</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase">Commune</label>
                  <p className="text-[13px] font-bold text-slate-700">{p?.Commune || "---"}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase">Filière</label>
                  <p className="text-[13px] font-bold text-slate-700 truncate">{p?.["Filière d'activité"] || "---"}</p>
                </div>
              </div>
            </section>

            <section className="space-y-2 pb-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <CheckCircle2 size={12} className="text-green-600" />
                <span>Indicateurs de Performance</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50/30 p-4 rounded-2xl border border-green-100/50 flex flex-col">
                  <span className="text-[9px] font-black text-green-600/70 uppercase mb-1">Adhérents</span>
                  <span className="text-2xl font-black text-slate-800 leading-none">{adherents}</span>
                </div>
                <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 flex flex-col">
                  <span className="text-[9px] font-black text-blue-600/70 uppercase mb-1">Capital Social</span>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-black text-slate-800 leading-none truncate">{p?.["Capital social"] || "0"}</span>
                    <span className="text-[10px] font-bold text-blue-600/50">DH</span>
                  </div>
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
