
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  Loader2
} from 'lucide-react';
import { CooperativeGeoJSON, CooperativeFeature } from './types';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';

// Fix for default Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GEOJSON_URL = "https://raw.githubusercontent.com/sigtopo/coop_driouch/refs/heads/main/CooperativesDriouch.geojson";

const MapFlyTo: React.FC<{ feature: CooperativeFeature | null }> = ({ feature }) => {
  const map = useMap();
  useEffect(() => {
    if (feature && feature.geometry.type === 'Point') {
      const [lng, lat] = feature.geometry.coordinates;
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    } else if (feature && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
      const layer = L.geoJSON(feature as any);
      map.fitBounds(layer.getBounds(), { padding: [50, 50], duration: 1.5 });
    }
  }, [feature, map]);
  return null;
};

const App: React.FC = () => {
  const [data, setData] = useState<CooperativeGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoop, setSelectedCoop] = useState<CooperativeFeature | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GEOJSON_URL);
        if (!response.ok) throw new Error("Échec du chargement des données");
        const json: CooperativeGeoJSON = await response.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFeatures = useMemo(() => {
    if (!data) return [];
    return data.features.filter(f => {
      const props = f.properties;
      const searchStr = searchTerm.toLowerCase();
      return Object.values(props).some(val => 
        String(val).toLowerCase().includes(searchStr)
      );
    });
  }, [data, searchTerm]);

  const geoJsonStyle = {
    fillColor: '#16a34a',
    weight: 2,
    opacity: 1,
    color: '#16a34a',
    dashArray: '3',
    fillOpacity: 0.4
  };

  const onEachFeature = (feature: CooperativeFeature, layer: L.Layer) => {
    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedCoop(feature);
      },
      mouseover: (e) => {
        const target = e.target;
        if (target.setStyle) {
          target.setStyle({
            weight: 5,
            color: '#22c55e',
            dashArray: '',
            fillOpacity: 0.7
          });
        }
      },
      mouseout: (e) => {
        const target = e.target;
        if (target.setStyle) {
          target.setStyle(geoJsonStyle);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-green-50 text-green-800">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-2xl font-bold font-sans">Chargement de la carte...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
        <div className="text-center font-sans">
          <h2 className="text-3xl font-bold mb-2">Erreur</h2>
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        features={filteredFeatures}
        selectedId={selectedCoop?.properties.id}
        onSelect={(f) => setSelectedCoop(f)}
      />

      <main className="flex-1 relative">
        <MapContainer 
          center={[34.98, -3.38]} 
          zoom={10} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data && (
            <GeoJSON 
              data={data as any} 
              onEachFeature={onEachFeature}
              style={geoJsonStyle}
              pointToLayer={(feature, latlng) => {
                return L.marker(latlng);
              }}
            />
          )}
          <MapFlyTo feature={selectedCoop} />
        </MapContainer>

        {selectedCoop && (
          <DetailPanel 
            coop={selectedCoop} 
            onClose={() => setSelectedCoop(null)} 
          />
        )}

        {!isSidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-[1000] p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 text-green-600"
          >
            <MapIcon size={24} />
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
