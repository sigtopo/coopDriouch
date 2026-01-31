
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Briefcase, 
  Users, 
  User, 
  GraduationCap, 
  Calendar,
  Building2,
  ChevronRight
} from 'lucide-react';
import { CooperativeFeature } from '../types';

interface DetailPanelProps {
  coop: CooperativeFeature;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ coop, onClose }) => {
  const p = coop.properties;
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  // منطق السحب للإغلاق في الموبايل
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 150) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  const formatGenre = (g: string) => {
    if (g === 'M') return 'Homme (ذكر)';
    if (g === 'F') return 'Femme (أنثى)';
    return g || 'Non spécifié';
  };

  return (
    <div 
      className="absolute bottom-0 md:inset-y-0 right-0 md:right-4 md:top-4 md:bottom-4 w-full md:w-96 z-[3000] p-0 md:p-0 flex pointer-events-none"
      style={{
        transform: window.innerWidth < 768 ? `translateY(${dragY}px)` : 'none',
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
    >
      <div className="bg-white w-full h-[75vh] md:h-full rounded-t-[2.5rem] md:rounded-3xl shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] md:shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-gray-100 animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
        
        {/* مقبض السحب للهاتف ومنطقة اللمس */}
        <div 
          className="md:hidden flex flex-col items-center p-3 shrink-0 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-1"></div>
          <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Glisser pour fermer</span>
        </div>

        {/* الهيدر */}
        <div className="px-6 py-5 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-xs uppercase tracking-[0.15em] opacity-90">Fiche de Coopérative</h2>
              <p className="text-[10px] font-bold text-green-200/80">Réf: {p.id || p.FID || '---'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
          >
            <X size={26} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white">
          
          {/* الاسم والنشاط */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-black text-gray-900 leading-[1.15] tracking-tight">
              {p['Nom de coopérative'] || p.Nom_Coop || "Coopérative"}
            </h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-800 rounded-full text-[11px] font-black uppercase tracking-wider border border-green-100">
              <Briefcase size={13} className="text-green-600" />
              {p["Filière d'activité"] || "Secteur non défini"}
            </div>
          </div>

          {/* الإحصائيات الأساسية */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50/50 p-3.5 rounded-2xl text-center space-y-1 border border-blue-100/50">
              <div className="flex justify-center text-blue-600 mb-1"><Users size={20} /></div>
              <div className="text-xl font-black text-blue-900">{p["Nombre des adhérents"] || 0}</div>
              <div className="text-[9px] font-black text-blue-500 uppercase">Membres</div>
            </div>
            <div className="bg-pink-50/50 p-3.5 rounded-2xl text-center space-y-1 border border-pink-100/50">
              <div className="flex justify-center text-pink-600 mb-1"><User size={20} /></div>
              <div className="text-xl font-black text-pink-900">{p["Nombre des femmes"] || 0}</div>
              <div className="text-[9px] font-black text-pink-500 uppercase">Femmes</div>
            </div>
            <div className="bg-orange-50/50 p-3.5 rounded-2xl text-center space-y-1 border border-orange-100/50">
              <div className="flex justify-center text-orange-600 mb-1"><Calendar size={20} /></div>
              <div className="text-xl font-black text-orange-900">{p["Nombre des jeunes"] || 0}</div>
              <div className="text-[9px] font-black text-orange-500 uppercase">Jeunes</div>
            </div>
          </div>

          {/* الموقع */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <MapPin size={16} className="text-green-600" />
              <span>Emplacement</span>
              <div className="flex-1 h-px bg-gray-100 ml-2"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 px-1">
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-bold text-xs uppercase">Commune</span>
                <span className="font-black text-gray-900 text-sm">{p.Commune || "---"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-bold text-xs uppercase">Province</span>
                <span className="font-black text-gray-900 text-sm">{p.Province || 'Driouch'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold text-xs uppercase">Douar</span>
                <span className="font-black text-gray-900 text-sm">{p["Douar/Quartier"] || "---"}</span>
              </div>
            </div>
          </section>

          {/* المسؤول والملف الشخصي */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <User size={16} className="text-green-600" />
              <span>Responsable & Profil</span>
              <div className="flex-1 h-px bg-gray-100 ml-2"></div>
            </div>
            <div className="bg-gray-50 rounded-3xl p-5 space-y-5 border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Président / Gestionnaire</p>
                <p className="text-base font-black text-gray-900">{p["Nom et prénom président/gestionnaire"] || "Non mentionné"}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200/50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Genre</p>
                  <p className="text-xs font-black text-gray-800">{formatGenre(p.Genre)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Date Naiss.</p>
                  <p className="text-xs font-black text-gray-800">{p["Date de naissance"] || "---"}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Niveau Scolaire</p>
                  <p className="text-xs font-black text-gray-800">{p["Niveau scolaire"] || "---"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* قسم التأسيس والتواصل - تم التعديل هنا */}
          <section className="space-y-4 pb-8">
            <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <Calendar size={16} className="text-green-600" />
              <span>Informations Légales</span>
              <div className="flex-1 h-px bg-gray-100 ml-2"></div>
            </div>
            
            <div className="space-y-6 px-1">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Date de création</p>
                <p className="text-sm font-black text-gray-700">{p["Date de création"] || "Non définie"}</p>
              </div>

              {p.Tel && (
                <div className="flex flex-col items-center space-y-3">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Contact Direct</p>
                  <a 
                    href={`tel:${p.Tel}`}
                    className="flex items-center gap-4 text-green-700 hover:text-green-800 transition-colors group"
                  >
                    <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-all border border-green-100">
                      <Phone size={24} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">{p.Tel}</span>
                  </a>
                  <p className="text-[9px] font-bold text-gray-300 italic">Appuyez sur le numéro pour appeler</p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* زر الإغلاق السفلي للديسكتوب */}
        <div className="p-5 bg-white border-t border-gray-50 hidden md:block">
           <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-[0.98]"
          >
            Fermer le Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
