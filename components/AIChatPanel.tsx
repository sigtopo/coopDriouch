
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Cooperative, ChatMessage } from '../types';

interface AIChatPanelProps {
  cooperatives: Cooperative[];
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ cooperatives }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await geminiService.analyzeCooperatives(userMsg, cooperatives);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response || 'نعتذر، لم استطع الحصول على رد.' }]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed bottom-6 left-6 z-50 flex flex-col items-end transition-all duration-300 ${isOpen ? 'w-full sm:w-96' : 'w-16'}`}>
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col w-full h-[500px] mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-green-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2 ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="font-bold">مساعد تعاون الذكي</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-green-600 rounded-full p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                <p>مرحباً بك! كيف يمكنني مساعدتك في العثور على التعاونية المناسبة؟</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => setInput('ابحث لي عن تعاونيات زراعية في السعودية')}
                    className="text-xs bg-white border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 text-green-700"
                  >
                    تعاونيات زراعية بالسعودية
                  </button>
                  <button 
                    onClick={() => setInput('ما هي أفضل التعاونيات الحرفية؟')}
                    className="text-xs bg-white border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 text-green-700"
                  >
                    أفضل الحرفيات
                  </button>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none animate-pulse text-gray-400 text-xs">
                  جارِ التحليل...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white border-t flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب استفسارك هنا..."
              className="flex-grow border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-green-700 text-white p-2 rounded-xl hover:bg-green-800 disabled:bg-gray-400 transition-colors"
            >
              <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-700 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-green-800 hover:scale-110 transition-all duration-300"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default AIChatPanel;
