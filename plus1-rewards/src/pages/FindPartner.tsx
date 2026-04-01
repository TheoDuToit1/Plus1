import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  BadgeCheck, 
  Phone, 
  MapPin, 
  Locate, 
  Layers, 
  Navigation,
  Clock,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from "react-leaflet";
import L from "leaflet";
import { supabase } from "../lib/supabase";
import "leaflet/dist/leaflet.css";

// Partner interface
interface Partner {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  phone: string;
  cashback: number;
  status: "Active" | "Inactive";
  lat: number;
  lng: number;
  partnerSince: string;
  iconType: "service" | "appliance" | "electronics" | "decor" | "furniture";
}

// Haversine formula to calculate distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Helper to center map only when explicitly changed (not on every render)
function MapController({ center, zoom, shouldUpdate }: { center: [number, number], zoom: number, shouldUpdate: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (shouldUpdate) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map, shouldUpdate]);
  return null;
}

// Helper to handle map events
function MapEvents({ onMoveEnd }: { onMoveEnd: (center: [number, number]) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      onMoveEnd([center.lat, center.lng]);
    };
    map.on('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onMoveEnd]);
  return null;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Partners");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [radius, setRadius] = useState(25);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.9249, 18.4241]);
  const [zoom, setZoom] = useState(12);
  const [mapLayer, setMapLayer] = useState<"standard" | "satellite" | "dark">("standard");
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch partners from Supabase
  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('status', 'active');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          // Transform database data to match Partner interface
          const transformedPartners: Partner[] = data.map((p: any) => {
            // Use actual coordinates if available, otherwise use default
            const hasValidCoords = p.latitude && p.longitude && 
                                   p.latitude !== 0 && p.longitude !== 0;
            
            return {
              id: p.id,
              name: p.shop_name || p.full_name || 'Unknown Partner',
              category: p.category || 'Service',
              address: p.address || 'Address not available',
              city: p.city || p.suburb || 'Cape Town',
              phone: p.phone || p.mobile_number || 'N/A',
              cashback: p.cashback_percent || 5,
              status: 'Active',
              lat: hasValidCoords ? p.latitude : -33.9249,
              lng: hasValidCoords ? p.longitude : 18.4241,
              partnerSince: p.created_at ? new Date(p.created_at).getFullYear().toString() : '2024',
              iconType: getCategoryIcon(p.category || 'Service')
            };
          });

          console.log('Loaded partners:', transformedPartners);
          setPartners(transformedPartners);
          
          // Set first partner as selected if available
          if (transformedPartners.length > 0) {
            setSelectedPartnerId(transformedPartners[0].id);
            // Center map on first partner
            const firstPartner = transformedPartners[0];
            setMapCenter([firstPartner.lat, firstPartner.lng]);
            setZoom(14);
          }
        } else {
          console.log('No partners found in database');
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  // Helper function to map category to icon type
  function getCategoryIcon(category: string): "service" | "appliance" | "electronics" | "decor" | "furniture" {
    const cat = category.toLowerCase();
    if (cat.includes('electronic') || cat.includes('tech')) return 'electronics';
    if (cat.includes('appliance') || cat.includes('kitchen')) return 'appliance';
    if (cat.includes('decor') || cat.includes('home')) return 'decor';
    if (cat.includes('furniture')) return 'furniture';
    return 'service';
  }

  const categories = ["All Partners", "Active", "Appliances", "Service", "Electronics", "Home Decor", "Furniture"];

  const filteredPartners = useMemo(() => {
    return partners.filter((p: Partner) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All Partners" || 
                              (activeCategory === "Active" && p.status === "Active") ||
                              p.category === activeCategory;
      
      const distance = getDistance(mapCenter[0], mapCenter[1], p.lat, p.lng);
      const matchesRadius = distance <= radius;

      return matchesSearch && matchesCategory && matchesRadius;
    });
  }, [searchQuery, activeCategory, radius, mapCenter, partners]);

  const selectedPartner = useMemo(() => 
    partners.find((p: Partner) => p.id === selectedPartnerId) || null
  , [selectedPartnerId, partners]);

  // Sync map center when partner is selected
  useEffect(() => {
    if (selectedPartner) {
      setMapCenter([selectedPartner.lat, selectedPartner.lng]);
      setZoom(14);
      setShouldUpdateMap(true);
      // Reset the flag after a short delay
      setTimeout(() => setShouldUpdateMap(false), 100);
    }
  }, [selectedPartner]);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        setZoom(15);
        setShouldUpdateMap(true);
        setTimeout(() => setShouldUpdateMap(false), 100);
      });
    }
  };

  const toggleLayer = () => {
    const layers: ("standard" | "satellite" | "dark")[] = ["standard", "satellite", "dark"];
    const currentIndex = layers.indexOf(mapLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    setMapLayer(layers[nextIndex]);
  };

  // Custom Marker Icons
  const createCustomIcon = (p: Partner) => {
    const isSelected = selectedPartnerId === p.id;
    const colorClass = isSelected ? 'bg-primary text-on-primary' : 'bg-white text-primary border-2 border-primary/20';
    const arrowColor = isSelected ? 'bg-primary' : 'bg-white border-r-2 border-b-2 border-primary/20';
    
    let iconSvg = '';
    switch(p.iconType) {
      case 'service': iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'; break;
      case 'appliance': iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/><path d="M10 10v4"/><path d="M14 10v4"/><path d="M5 10h14"/></svg>'; break;
      case 'electronics': iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="3" rx="2" ry="2"/><path d="M17 21l-1.5-4h-7L7 21"/><path d="M2 13h20"/></svg>'; break;
      case 'decor': iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>'; break;
      case 'furniture': iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/><path d="M10 12v.01"/></svg>'; break;
    }
    
    return L.divIcon({
      html: `
        <div class="relative group">
          <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg relative transition-all duration-300 group-hover:scale-110 ${colorClass}">
            ${iconSvg}
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${arrowColor}"></div>
          </div>
        </div>
      `,
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });
  };

  const getTileUrl = () => {
    switch(mapLayer) {
      case "satellite": return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "dark": return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      default: return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  return (
    <main className="find-partner-page flex h-screen w-full relative overflow-hidden font-sans bg-white">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[440px] h-full bg-surface-container-low z-20 overflow-y-auto px-8 py-10 gap-y-10 shrink-0 border-r border-outline-variant/30">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group w-fit -mt-2"
        >
          <div className="w-9 h-9 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <ChevronRight size={18} className="rotate-180" />
          </div>
          <span className="text-sm font-bold">Back</span>
        </button>

        {/* Branding & Search */}
        <div className="flex flex-col gap-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-primary leading-none">
              The Editorial Archive
            </h1>
            <p className="text-on-surface-variant font-medium mt-3 text-sm tracking-wide uppercase">
              Curated Partner Directory
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant">
              <Search size={18} />
            </div>
            <input 
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-outline-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-on-surface-variant/40 text-on-surface transition-all shadow-sm"
              placeholder="Search by name or city..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                activeCategory === cat 
                  ? "bg-primary text-on-primary border-primary shadow-md" 
                  : "bg-white text-on-surface-variant border-outline-variant/50 hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Partner List Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <h2 className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase">
            Featured Partners
          </h2>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-black">
            {filteredPartners.length} RESULTS
          </span>
        </div>

        {/* Partner Cards Stack */}
        <div className="flex flex-col gap-y-4 pb-12">
          {loading ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-bold text-on-surface">Loading partners...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPartners.map((partner: Partner) => (
              <motion.div
                key={partner.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedPartnerId(partner.id)}
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  selectedPartnerId === partner.id 
                    ? 'border-primary shadow-xl ring-1 ring-primary/20' 
                    : 'border-outline-variant/30 hover:border-primary/50 hover:shadow-lg'
                }`}
              >
                {selectedPartnerId === partner.id && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <BadgeCheck size={14} className="text-primary" />
                      <span className="text-primary font-bold text-[10px] uppercase tracking-wider">{partner.status}</span>
                    </div>
                  </div>
                  <div className="bg-primary text-on-primary px-3 py-2 rounded-xl text-center flex flex-col justify-center min-w-[64px] shadow-sm">
                    <span className="text-[8px] opacity-80 uppercase tracking-widest font-black">Cashback</span>
                    <span className="text-lg font-black leading-none mt-0.5">{partner.cashback}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                      <MapPin size={14} />
                    </div>
                    <span className="text-xs font-bold capitalize truncate">{partner.address}, {partner.city}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-on-surface-variant" />
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Partner Since {partner.partnerSince}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${selectedPartnerId === partner.id ? 'translate-x-1 text-primary' : 'text-outline-variant'}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
          
          {!loading && filteredPartners.length === 0 && (
            <div className="text-center py-20 px-6 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search size={24} className="text-outline-variant" />
              </div>
              <p className="text-sm font-bold text-on-surface">No partners in this area</p>
              <p className="text-xs text-on-surface-variant mt-1">Try expanding your search radius or changing categories.</p>
              <button 
                onClick={() => setRadius(50)}
                className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
              >
                Expand to 50km
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Map View */}
      <section className="flex-1 relative h-full bg-surface-dim">
        <MapContainer 
          center={mapCenter} 
          zoom={zoom} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl()}
          />
          <MapController center={mapCenter} zoom={zoom} shouldUpdate={shouldUpdateMap} />
          <MapEvents onMoveEnd={setMapCenter} />
          <ZoomControl position="bottomright" />
          
          {filteredPartners.map((p: Partner) => (
            <Marker 
              key={p.id} 
              position={[p.lat, p.lng]} 
              icon={createCustomIcon(p)}
              eventHandlers={{
                click: () => setSelectedPartnerId(p.id),
              }}
            >
              <Popup className="custom-popup" minWidth={280} maxWidth={320}>
                <div className="p-5 bg-white">
                  {/* Header with close button */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-[#0f3d5c] m-0 leading-tight mb-1.5">{p.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck size={12} className="text-[#14b8a6]" />
                        <span className="text-[9px] font-bold uppercase text-[#14b8a6] tracking-wider">{p.status}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#0f3d5c] to-[#1a5170] text-white px-3.5 py-2.5 rounded-xl text-center shadow-lg ml-3 min-w-[60px]">
                      <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">Cashback</span>
                      <span className="text-xl font-black leading-none block mt-0.5">{p.cashback}%</span>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#e2e8f0] to-transparent mb-4"></div>
                  
                  {/* Info Grid */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 group-hover:bg-[#0f3d5c]/5 transition-colors">
                        <MapPin size={16} className="text-[#0f3d5c]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-[9px] font-black uppercase text-[#94a3b8] tracking-wider mb-0.5">Location</p>
                        <p className="text-xs font-bold text-[#0f172a] leading-snug">{p.address}<br/>{p.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 group-hover:bg-[#0f3d5c]/5 transition-colors">
                        <Phone size={16} className="text-[#0f3d5c]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-[9px] font-black uppercase text-[#94a3b8] tracking-wider mb-0.5">Contact</p>
                        <a href={`tel:${p.phone}`} className="text-xs font-bold text-[#0f3d5c] hover:text-[#1a5170] transition-colors no-underline">{p.phone}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 group">
                      <div className="w-9 h-9 rounded-xl bg-[#f8fafc] flex items-center justify-center shrink-0 group-hover:bg-[#0f3d5c]/5 transition-colors">
                        <Clock size={16} className="text-[#0f3d5c]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-[9px] font-black uppercase text-[#94a3b8] tracking-wider mb-0.5">Partner Since</p>
                        <p className="text-xs font-bold text-[#0f172a]">{p.partnerSince}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-gradient-to-r from-[#0f3d5c] to-[#1a5170] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 hover:shadow-xl hover:shadow-[#0f3d5c]/20 transition-all active:scale-[0.98] no-underline group"
                  >
                    <Navigation size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Top Controls */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center pointer-events-none z-[1000]">
          <div className="flex gap-4 pointer-events-auto">
            <div className="glass-panel flex items-center gap-5 px-6 py-3 rounded-2xl border border-white/40 shadow-2xl">
              <div className="flex items-center gap-2">
                <Locate size={14} className="text-primary" />
                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Radius</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-40 h-1.5 bg-outline-variant/30 rounded-full relative cursor-pointer">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full shadow-[0_0_10px_rgba(26,85,139,0.3)]" 
                    style={{ width: `${(radius / 50) * 100}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-lg pointer-events-none transition-transform hover:scale-110"
                    style={{ left: `${(radius / 50) * 100}%`, marginLeft: '-10px' }}
                  ></div>
                </div>
                <span className="text-xs font-black text-primary w-12 tabular-nums">{radius}km</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pointer-events-auto">
            <button 
              onClick={handleLocate}
              title="My Location"
              className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-on-surface shadow-xl border border-white/40 hover:bg-white hover:text-primary transition-all duration-300 active:scale-95"
            >
              <Locate size={20} />
            </button>
            <button 
              onClick={toggleLayer}
              title="Toggle Map Layer"
              className="w-12 h-12 glass-panel rounded-2xl flex items-center justify-center text-on-surface shadow-xl border border-white/40 hover:bg-white hover:text-primary transition-all duration-300 active:scale-95"
            >
              <Layers size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Detail Panel */}
        <AnimatePresence>
          {selectedPartner && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="lg:hidden absolute bottom-0 left-0 right-0 p-6 z-[1001] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-outline-variant/20"
            >
              <div className="w-12 h-1.5 bg-outline-variant/30 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-on-surface leading-tight">{selectedPartner.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <BadgeCheck size={16} className="text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedPartner.status}</span>
                  </div>
                </div>
                <div className="premium-gradient text-on-primary px-4 py-2 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-widest block opacity-80">Cashback</span>
                  <span className="text-xl font-black">{selectedPartner.cashback}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-surface-container rounded-2xl">
                  <Phone size={16} className="text-primary mb-2" />
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Call</p>
                  <p className="text-xs font-bold text-on-surface">{selectedPartner.phone}</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <MapPin size={16} className="text-primary mb-2" />
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Visit</p>
                  <p className="text-xs font-bold text-on-surface truncate">{selectedPartner.city}</p>
                </div>
              </div>

              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPartner.lat},${selectedPartner.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-primary text-on-primary font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] no-underline"
              >
                <Navigation size={20} />
                START NAVIGATION
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}




