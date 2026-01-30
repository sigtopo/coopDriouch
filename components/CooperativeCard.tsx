
import React from 'react';
import { Cooperative } from '../types';

interface CooperativeCardProps {
  coop: Cooperative;
  onSelect: (coop: Cooperative) => void;
}

const CooperativeCard: React.FC<CooperativeCardProps> = ({ coop, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group cursor-pointer"
      onClick={() => onSelect(coop)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={coop.image} 
          alt={coop.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {coop.sector}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
          {coop.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {coop.description}
        </p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {coop.location}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              <span className="text-sm font-bold mr-1">{coop.rating}</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-gray-400 text-xs font-medium">
              {coop.membersCount} عضو
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CooperativeCard;
