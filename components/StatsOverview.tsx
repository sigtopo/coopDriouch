
import React, { useMemo } from 'react';
import { CooperativeGeoJSON } from '../types';
import { Database, TrendingUp, Users } from 'lucide-react';

interface StatsOverviewProps {
  data: CooperativeGeoJSON;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ data }) => {
  const stats = useMemo(() => {
    const total = data.features.length;
    const sectors = new Set();
    const communes = new Set();
    
    data.features.forEach(f => {
      const sector = f.properties["Filière d'activité"] || f.properties.Secteur;
      if (sector) sectors.add(sector);
      if (f.properties.Commune) communes.add(f.properties.Commune);
    });

    return {
      total,
      sectorsCount: sectors.size,
      communesCount: communes.size
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-4 transition hover:scale-105">
        <div className="bg-green-100 p-2 rounded-xl text-green-600">
          <Database size={20} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Coopératives</div>
          <div className="text-lg font-bold text-gray-800">{stats.total}</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-4 transition hover:scale-105">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <TrendingUp size={20} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Secteurs d'activité</div>
          <div className="text-lg font-bold text-gray-800">{stats.sectorsCount}</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-4 transition hover:scale-105">
        <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
          <Users size={20} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Communes couvertes</div>
          <div className="text-lg font-bold text-gray-800">{stats.communesCount}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
