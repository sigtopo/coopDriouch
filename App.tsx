
import React, { useState, useMemo } from 'react';
import { MOCK_COOPERATIVES, SECTORS } from './constants';
import { Cooperative, Sector } from './types';
import CooperativeCard from './components/CooperativeCard';
import AIChatPanel from './components/AIChatPanel';

const App: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoop, setSelectedCoop] = useState<Cooperative | null>(null);

  const filteredCooperatives = useMemo(() => {
    return MOCK_COOPERATIVES.filter(coop => {
      const matchesSector = selectedSector === 'الكل' || coop.sector === selectedSector;
      const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            coop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coop.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [selectedSector, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Tajawal']" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-green-900 tracking-tight">تعاون</h1>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
            <a href="#" className="text-green-700 border-b-2 border-green-700">الرئيسية</a>
            <a href="#" className="hover:text-green-700 transition-colors">استكشف</a>
            <a href="#" className="hover:text-green-700 transition-colors">عن المنصة</a>
            <a href="#" className="hover:text-green-700 transition-colors">انضم إلينا</a>
          </nav>

          <button className="bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-800 transition-all shadow-md active:scale-95">
            تسجيل الدخول
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-green-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-3xl opacity-10 -ml-20 -mb-20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">اكتشف قوة العمل المشترك</h2>
          <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            منصة تجمع التعاونيات العربية في مكان واحد، لتسهيل وصولك للمنتجات والخدمات المحلية المتميزة، ودعم التنمية المستدامة.
          </p>
          
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-grow flex items-center px-4 bg-gray-50 rounded-xl">
              <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="ابحث عن تعاونية، قطاع، أو مدينة..."
                className="w-full py-3 bg-transparent text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95">
              بحث سريع
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-3 pb-2 md:pb-0">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedSector === sector 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">التعاونيات المتاحة</h3>
            <p className="text-gray-500 mt-1">يظهر حالياً {filteredCooperatives.length} تعاونية</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white border rounded-lg text-gray-400 hover:text-green-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button className="p-2 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          </div>
        </div>

        {filteredCooperatives.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCooperatives.map(coop => (
              <CooperativeCard 
                key={coop.id} 
                coop={coop} 
                onSelect={(c) => setSelectedCoop(c)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h4 className="text-xl font-bold text-gray-800">لا توجد تعاونيات مطابقة</h4>
            <p className="text-gray-500 mt-2">جرب تغيير معايير البحث أو اختيار قطاع آخر.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedSector('الكل');}}
              className="mt-6 text-green-700 font-bold hover:underline"
            >
              إعادة تعيين المرشحات
            </button>
          </div>
        )}
      </main>

      {/* Modal for Cooperative Details */}
      {selectedCoop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95">
            <button 
              onClick={() => setSelectedCoop(null)}
              className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-all backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="h-64 md:h-80 relative">
              <img 
                src={selectedCoop.image} 
                alt={selectedCoop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6 text-white">
                <div className="bg-green-600 inline-block px-3 py-1 rounded-full text-xs font-bold mb-3">
                  {selectedCoop.sector}
                </div>
                <h2 className="text-3xl font-black">{selectedCoop.name}</h2>
                <p className="flex items-center text-green-200 mt-2 text-sm">
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {selectedCoop.location}
                </p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-grow bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-green-600 pr-3">نظرة عامة</h4>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">
                    {selectedCoop.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedCoop.tags.map(tag => (
                      <span key={tag} className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-medium border border-green-100">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-4 border-r-4 border-green-600 pr-3">المساهمة الاجتماعية</h4>
                  <p className="text-gray-500 mb-6">
                    تساهم هذه التعاونية بشكل مباشر في دعم الاقتصاد المحلي وتوفير فرص عمل لأكثر من {selectedCoop.membersCount} عائلة في منطقة {selectedCoop.location}.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl h-fit border border-slate-100">
                  <h4 className="font-bold text-gray-900 mb-6 text-center">معلومات سريعة</h4>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">عدد الأعضاء</p>
                        <p className="font-bold text-gray-800">{selectedCoop.membersCount} عضو</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">تاريخ التأسيس</p>
                        <p className="font-bold text-gray-800">{selectedCoop.establishedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">التقييم العام</p>
                        <p className="font-bold text-gray-800">{selectedCoop.rating} / 5.0</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-8 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg active:scale-95">
                    تواصل الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AIChatPanel cooperatives={MOCK_COOPERATIVES} />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h1 className="text-xl font-bold text-white">تعاون</h1>
            </div>
            <p className="max-w-md leading-relaxed">
              منصة تعاون هي مبادرة تقنية تهدف لدعم القطاع التعاوني العربي عبر تعزيز الشفافية وتسهيل الوصول للبيانات والفرص الاستثمارية والاجتماعية.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">روابط سريعة</h5>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-green-500 transition-colors">عن المنصة</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">التعاونيات المسجلة</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">سجل تعاونيتك</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">تواصل معنا</h5>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                info@taawon.com
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +966 500 000 000
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          <p>© {new Date().getFullYear()} منصة تعاون. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
