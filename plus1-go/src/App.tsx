import { useState, useEffect } from 'react';
import { AnimatedHamburger } from './components/AnimatedHamburger';
import { 
  Heart, 
  Star, 
  Search, 
  ShoppingCart, 
  User, 
  Home, 
  MapPin,
  ChevronDown,
  ShoppingBag,
  Car,
  Wine,
  Store,
  Baby,
  Tag,
  ChevronRight,
  ChevronLeft,
  Apple,
  Pill,
  PawPrint,
  Cpu,
  PenLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Restaurant } from './types';
import PartnerDetail from './components/PartnerDetail';
import { supabase } from './lib/supabase';

const MobileNav = ({ activeTab = 'home', basketCount = 0 }: { activeTab?: string; basketCount?: number }) => (
  <nav className="desktop:hidden fixed bottom-0 w-full z-50 pointer-events-none">
    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    <div className="relative flex justify-center pb-2 px-4">
      <div className="pointer-events-auto flex items-center gap-1.5 max-w-md w-full justify-between">
        <button className={`flex items-center justify-center bg-white rounded-full h-10 w-10 shadow-lg border border-zinc-100 transition-all hover:scale-110 active:scale-95 ${activeTab === 'home' ? 'text-emerald-600' : 'text-zinc-500'}`}>
          <Home className={`w-4 h-4 ${activeTab === 'home' ? 'fill-emerald-600' : ''}`} />
        </button>
        <button className={`flex items-center justify-center bg-white rounded-full h-10 w-10 shadow-lg border border-zinc-100 transition-all hover:scale-110 active:scale-95 ${activeTab === 'browse' ? 'text-emerald-600' : 'text-zinc-500'}`}>
          <Search className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center bg-white h-10 rounded-full px-3 gap-1.5 shadow-lg border border-zinc-100 cursor-pointer transition-all hover:bg-zinc-50 active:scale-98">
          <Tag className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500 text-xs font-semibold">Offers</span>
        </div>
        <button className={`relative flex items-center justify-center bg-white rounded-full h-10 w-10 shadow-lg border border-zinc-100 transition-all hover:scale-110 active:scale-95 ${activeTab === 'cart' ? 'text-emerald-600' : 'text-zinc-500'}`}>
          <ShoppingCart className="w-4 h-4" />
          {basketCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {basketCount}
            </span>
          )}
        </button>
        <button className={`flex items-center justify-center bg-white rounded-full h-10 w-10 shadow-lg border border-zinc-100 transition-all hover:scale-110 active:scale-95 ${activeTab === 'user' ? 'text-emerald-600' : 'text-zinc-500'}`}>
          <User className="w-4 h-4" />
        </button>
      </div>
    </div>
  </nav>
);







export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [partners, setPartners] = useState<Restaurant[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const basketCount = 0;

  // Check for Plus1-Rewards session
  useEffect(() => {
    const checkSession = () => {
      // Check localStorage first (remember me)
      const localSession = localStorage.getItem('memberSession');
      if (localSession) {
        try {
          const session = JSON.parse(localSession);
          
          // Check if session has expired
          if (session.expiresAt) {
            const expiryDate = new Date(session.expiresAt);
            const now = new Date();
            
            if (now > expiryDate) {
              // Session expired, clear it
              localStorage.removeItem('memberSession');
              sessionStorage.removeItem('memberSession');
              setCurrentUser(null);
              return;
            }
          }
          
          // Sync to sessionStorage if not there
          if (!sessionStorage.getItem('memberSession')) {
            sessionStorage.setItem('memberSession', localSession);
          }
          
          setCurrentUser(session.user);
          return;
        } catch (e) {
          console.error('Error parsing localStorage session:', e);
          localStorage.removeItem('memberSession');
        }
      }
      
      // Check sessionStorage
      const sessionSession = sessionStorage.getItem('memberSession');
      if (sessionSession) {
        try {
          const session = JSON.parse(sessionSession);
          
          // Check if session has expired
          if (session.expiresAt) {
            const expiryDate = new Date(session.expiresAt);
            const now = new Date();
            
            if (now > expiryDate) {
              sessionStorage.removeItem('memberSession');
              setCurrentUser(null);
              return;
            }
          }
          
          setCurrentUser(session.user);
        } catch (e) {
          console.error('Error parsing sessionStorage session:', e);
          sessionStorage.removeItem('memberSession');
        }
      }
    };

    checkSession();
    
    // Re-check session when window gains focus (user switches back to tab)
    const handleFocus = () => {
      checkSession();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Log when selectedRestaurant changes
  useEffect(() => {
    console.log('selectedRestaurant changed:', selectedRestaurant);
  }, [selectedRestaurant]);

  // Fetch partners from database
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoadingPartners(true);
        const { data, error } = await supabase
          .from('partners')
          .select('id, shop_name, store_banner_url, rating, average_prep_time_minutes')
          .limit(4);

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Partners fetched:', data);

        const formattedPartners: Restaurant[] = (data || []).map(p => ({
          id: p.id,
          name: p.shop_name,
          image: p.store_banner_url || 'https://via.placeholder.com/400x300?text=Partner',
          deliveryFee: 'Free Delivery',
          timeRange: `${p.average_prep_time_minutes || 30}–${(p.average_prep_time_minutes || 30) + 10} min`,
          rating: p.rating || 4.5,
          isFavorite: false,
        }));

        // If no partners from DB, use demo data for testing
        if (formattedPartners.length === 0) {
          console.log('No partners in database, using demo data');
          const demoPartners: Restaurant[] = [
            {
              id: 'demo-1',
              name: "L'Artisan Bistro",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0cYxqjsJmhbqDBhPL4-eBXB0ls7o9NNKew1qpW12l_HoPhbr_sJ_q9NSS8h7k-PR0enSqI25FRfYp7ie8rgvxHDGyUfYUtlotDg75ucb__ElEIBRqpBrzcwP1effBn1BHjeNZ995jn-qcrQrgGus6h-6ab8BHHOpljFrcv2ebHudiiFmk4eNjaQp011cvQwYCeIUltn-FlT-QA7OwLzIhiyxYjZFV7F3EKwxRmSK_mz3wPMtl-1jWJbT5nhhKN-IVna4fpiCpZRYG",
              deliveryFee: 'Free Delivery',
              timeRange: '25–35 min',
              rating: 4.8,
              isFavorite: true,
            },
            {
              id: 'demo-2',
              name: "Napoli Wood Fired",
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKkZ1Zp8xmp9FxPnk5SA4-GIB6jLM0P98WrJhORHk5F7SyGoyuFk9THapmV5tZONbEpEjh5VkKQRetw4K-6uuSIHzBrTPpLW19Zc8KT1vqXlnCX6ENSY1Wh2h3cbAcO7gCbXt0Sz75inzkkkvDkUDPQiztykylYilA60f8EG9BJCurPO44MeGTzmeIQE_rEgbTjL_Xfc3K3IUz9b03s9GryYSffiVmuUEdS4H_7FNAVfv4QZEmpX-lH9c_RtQBwNtxisDZ0HF-dNUA",
              deliveryFee: 'Free Delivery',
              timeRange: '15–25 min',
              rating: 4.6,
              isFavorite: false,
            },
          ];
          setPartners(demoPartners);
        } else {
          setPartners(formattedPartners);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    // Scroll listener for future use
    const handleScroll = () => {
      // window.scrollY > 20
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopCategories = [
    { name: 'All', icon: '🛍️', active: true },
    { name: 'Grocery', icon: '🍌' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Indian', icon: '🍲' },
    { name: 'Healthy', icon: '🥗' },
    { name: 'Mexican', icon: '🌮' },
    { name: 'Wings', icon: '🍗' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Chinese', icon: '🥡' },
    { name: 'Halal', icon: '🥙' },
    { name: 'Fast food', icon: '🍟' },
    { name: 'Korean', icon: '🥘' },
    { name: 'Thai', icon: '🍛' },
    { name: 'Seafood', icon: '🍤' },
    { name: 'Vegan', icon: '🌿' },
    { name: 'Italian', icon: '🍝' },
  ];

  const filters = [
    { name: 'Offers', icon: <Tag className="w-4 h-4" /> },
    { name: 'Delivery Fee', hasChevron: true },
    { name: 'Under 30 min' },
    { name: 'Highest rated' },
    { name: 'Rating', hasChevron: true },
    { name: 'Sort', hasChevron: true },
  ];

  const sidebarItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Grocery', icon: Apple },
    { name: 'Convenience', icon: Store },
    { name: 'Alcohol', icon: Wine },
    { name: 'Health', icon: Pill },
    { name: 'Retail', icon: ShoppingBag },
    { name: 'Pet', icon: PawPrint },
    { name: 'Baby', icon: Baby },
    { name: 'Personal care', icon: Heart },
    { name: 'Electronics', icon: Cpu },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-zinc-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {selectedRestaurant ? (
          <PartnerDetail 
            key="detail"
            partnerId={selectedRestaurant.id}
            onBack={() => setSelectedRestaurant(null)}
          />
        ) : (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-x-hidden w-full"
          >
            {/* Desktop Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100 h-16 desktop:h-24 flex items-center px-4 desktop:px-10 gap-3 desktop:gap-10">
              <div className="flex items-center gap-2 desktop:gap-6 flex-shrink-0">
                <AnimatedHamburger 
                  isOpen={isSidebarOpen}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div className="flex items-center gap-2">
                  <a href="/go" className="cursor-pointer">
                    <img 
                      src="/plus1-go logo.png" 
                      alt="Plus1-Go" 
                      className="h-10 desktop:h-16 w-auto select-none hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <a href="/" className="cursor-pointer">
                    <img 
                      src="/logo.png" 
                      alt="Logo" 
                      className="h-8 desktop:h-12 w-auto select-none hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 max-w-3xl">
                <div className="flex-1 relative group">
                  <div className="absolute left-3 desktop:left-4 top-1/2 -translate-y-1/2 text-zinc-900">
                    <MapPin className="w-4 h-4 desktop:w-5 desktop:h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Address" 
                    className="w-full bg-zinc-100 border-none rounded-full py-2 desktop:py-3.5 pl-9 desktop:pl-12 pr-4 focus:ring-2 focus:ring-black transition-all text-[10px] desktop:text-sm font-bold placeholder:text-zinc-500"
                  />
                </div>
                <div className="hidden lg:flex items-center gap-2 bg-zinc-100 px-5 py-3.5 rounded-full cursor-pointer hover:bg-zinc-200 transition-colors">
                  <span className="font-bold text-sm whitespace-nowrap">Deliver now</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="hidden xl:flex items-center bg-zinc-100 rounded-full p-1.5 flex-shrink-0">
                <button className="px-6 py-2 rounded-full bg-white shadow-sm text-sm font-bold">Delivery</button>
                <button className="px-6 py-2 rounded-full text-sm font-bold text-zinc-600 hover:bg-zinc-200 transition-colors">Pickup</button>
              </div>

              <div className="hidden desktop:flex items-center gap-1 desktop:gap-6 ml-auto flex-shrink-0">
                <button className="relative p-2 desktop:p-2.5 hover:bg-zinc-100 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 desktop:w-6 desktop:h-6" />
                  {basketCount > 0 && (
                    <span className="absolute top-0 right-0 desktop:top-1 desktop:right-1 bg-emerald-500 text-white text-[8px] desktop:text-[10px] font-bold w-4 h-4 desktop:w-5 desktop:h-5 rounded-full flex items-center justify-center border-2 border-white">{basketCount}</span>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-zinc-700">Hi, {currentUser.full_name?.split(' ')[0]}</span>
                      <button className="p-2.5 hover:bg-zinc-100 rounded-full transition-colors">
                        <User className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <a href="/login" className="px-5 py-2.5 font-bold text-sm hover:bg-zinc-100 rounded-full transition-colors">Log in</a>
                      <a href="/register" className="px-5 py-2.5 bg-black text-white font-bold text-sm rounded-full hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10">Sign up</a>
                    </>
                  )}
                </div>
              </div>
            </header>

      <div className="flex pt-16 desktop:pt-24">
        {/* Desktop Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <>
              {/* Mobile Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60] desktop:hidden"
              />
              
              <motion.aside 
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed desktop:sticky top-16 desktop:top-24 left-0 h-[calc(100vh-64px)] desktop:h-[calc(100vh-96px)] w-72 bg-white z-[70] desktop:z-40 border-r border-zinc-100 overflow-y-auto flex flex-col flex-shrink-0 pt-0"
              >
                <div className="desktop:hidden p-4 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a href="/go" className="cursor-pointer">
                      <img 
                        src="/plus1-go logo.png" 
                        alt="Plus1-Go" 
                        className="h-10 w-auto hover:opacity-80 transition-opacity"
                      />
                    </a>
                    <a href="/" className="cursor-pointer">
                      <img 
                        src="/logo.png" 
                        alt="Logo" 
                        className="h-8 w-auto hover:opacity-80 transition-opacity"
                      />
                    </a>
                  </div>
                  <AnimatedHamburger 
                    isOpen={isSidebarOpen}
                    onClick={() => setIsSidebarOpen(false)}
                  />
                </div>
                <nav className="py-4 flex-1 flex flex-col">
                  {sidebarItems.map((item) => (
                    <button 
                      key={item.name}
                      className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200 relative ${item.active ? 'bg-zinc-100 font-bold text-black' : 'hover:bg-zinc-50 text-zinc-600 font-semibold'}`}
                    >
                      {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-black' : 'text-zinc-400'}`} />
                      <span className="text-[15px]">{item.name}</span>
                    </button>
                  ))}
                  <div className="my-4 border-t border-zinc-100 mx-6" />
                  <div className="space-y-0.5">
                    <button className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-zinc-50 text-zinc-600 font-semibold transition-all">
                      <Tag className="w-5 h-5 text-zinc-400" />
                      <span className="text-[15px]">Offers</span>
                    </button>
                    <a href="/register" className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-zinc-50 text-zinc-600 font-semibold transition-all">
                      <PenLine className="w-5 h-5 text-zinc-400" />
                      <span className="text-[15px]">Sign up</span>
                    </a>
                    <a href="/login" className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-zinc-50 text-zinc-600 font-semibold transition-all">
                      <User className="w-5 h-5 text-zinc-400" />
                      <span className="text-[15px]">Log in</span>
                    </a>
                  </div>
                  <div className="my-6 border-t border-zinc-100 mx-6" />
                  <div className="px-6 space-y-4">
                    <button className="w-full flex items-center gap-4 py-2 hover:text-black text-zinc-600 font-semibold transition-all">
                      <Store className="w-5 h-5 text-zinc-400" />
                      <span className="text-[15px]">Add your restaurant</span>
                    </button>
                    <button className="w-full flex items-center gap-4 py-2 hover:text-black text-zinc-600 font-semibold transition-all">
                      <Car className="w-5 h-5 text-zinc-400" />
                      <span className="text-[15px]">Sign up to deliver</span>
                    </button>
                  </div>
                  
                  <div className="mt-auto p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <a 
                        href="https://dribbble.com/shots/9020776-Menu-animation" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        <img 
                          src="https://dribbble.com/assets/logo-small-2x-9fe74d2ad7b25fba0f50168523c15fda4c35534f9ea0b1011179275383035439.png" 
                          alt="Dribbble" 
                          className="w-5 h-5"
                          referrerPolicy="no-referrer"
                        />
                      </a>
                      <a 
                        href="https://twitter.com/aaroniker_me" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        <svg className="w-5 h-5 fill-black" viewBox="0 0 72 72">
                          <path d="M67.812 16.141a26.246 26.246 0 0 1-7.519 2.06 13.134 13.134 0 0 0 5.756-7.244 26.127 26.127 0 0 1-8.313 3.176A13.075 13.075 0 0 0 48.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 0 0-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 0 1-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 0 1-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 0 1-16.26 5.606A26.21 26.21 0 0 1 4 55.976a37.036 37.036 0 0 0 20.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 0 0 6.533-6.774z"></path>
                        </svg>
                      </a>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium">Menu animation by Aaron Iker</p>
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 desktop:px-12 pb-20 max-w-[1600px] mx-auto overflow-x-hidden">
          {/* Categories Carousel */}
          <section className="py-8 relative group overflow-hidden w-full">
            <div className="flex gap-3 sm:gap-4 desktop:gap-10 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
              {desktopCategories.map((cat) => (
                <div key={cat.name} className="flex flex-col items-center gap-3 cursor-pointer group/cat flex-shrink-0">
                  <div className={`w-14 h-14 desktop:w-20 desktop:h-20 rounded-full flex items-center justify-center text-2xl desktop:text-4xl transition-all duration-300 ${cat.active ? 'bg-zinc-100 scale-110 shadow-sm' : 'bg-white border border-zinc-100 hover:bg-zinc-50 hover:scale-105'}`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] desktop:text-xs font-bold tracking-tight ${cat.active ? 'text-black' : 'text-zinc-500'}`}>{cat.name}</span>
                </div>
              ))}
            </div>
            <button className="hidden desktop:block absolute right-[-20px] top-[45%] -translate-y-1/2 bg-white shadow-premium rounded-full p-3 border border-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </section>

          {/* Filters */}
          <section className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-8 sticky top-16 sm:top-32 desktop:top-24 bg-white/80 backdrop-blur-md z-30 py-2 w-full">
            {filters.map((filter) => (
              <button 
                key={filter.name}
                className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap active:scale-95"
              >
                {filter.icon}
                {filter.name}
                {filter.hasChevron && <ChevronDown className="w-4 h-4" />}
              </button>
            ))}
          </section>

          {/* Banners - Bento Style */}
          <section className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 gap-6 mb-16">
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative h-64 desktop:h-80 rounded-3xl overflow-hidden bg-emerald-600 p-8 desktop:p-10 text-white group cursor-pointer shadow-premium"
            >
              <div className="relative z-10 max-w-[85%] desktop:max-w-[70%]">
                <h3 className="text-2xl desktop:text-3xl font-black leading-[1.1] mb-4">Stock up this payday on all your essentials</h3>
                <p className="text-base font-bold mb-6 opacity-90">Fill the fridge with treats and drinks.</p>
                <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-black hover:bg-zinc-100 transition-all active:scale-95">Shop now</button>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhz1WoO9jgLRnz551ygQ_NfAr99Mpp6tv-LAJZ1OSjJEerQ89gvnZsTCRexeZLF1e2JwR_IW1oMZh4I0-vnf4dfvC8lE6SkVluCa5PGw1Wzpkf2DQrV8w6Eg-jdIC6kowO5ZTdq2VHEo4OGNxVxIATKXwYlik96UH26lZA9PJBKCEuPcUs4sCsJvWZG3_Ycs6L1i1jiCBxTQWqEcEsbVX8nGDRBBACt72lqERech5mLq_dQEaWYMfwt5eYadequU_lCgZ5OUyb1UYT" 
                className="absolute right-[-15%] bottom-[-15%] w-64 desktop:w-80 h-64 desktop:h-80 object-contain rotate-12 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-700 ease-out"
                alt="Banner 1"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative h-64 desktop:h-80 rounded-3xl overflow-hidden bg-[#FDF2E9] p-8 desktop:p-10 group cursor-pointer shadow-premium"
            >
              <div className="relative z-10 max-w-[85%] desktop:max-w-[70%]">
                <h3 className="text-2xl desktop:text-3xl font-black leading-[1.1] mb-4 text-[#432818]">WHOPPER® With Cheese Med Meal for R90</h3>
                <p className="text-base font-bold mb-6 text-[#432818]/70">Big Taste. Big Deal. 🍔</p>
                <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:bg-zinc-800 transition-all active:scale-95">Order now</button>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYl5tVRM5S56dabwflOEaUOsKCG1MZF9hA9weXVAV8CivTBpX7zWEitHpQ6om99y_x7CsThVr2pWbl-5e9RpKjJIIufXsqri8UQnwdioh4tDEjPTC067EHhEhhmwY787YvHMjdOqB_nOzwPwd3lEdCDQ80emFnR-IZ2C1S1Ikw_x1lq_o0VeSpbQeE_NCkXR0JwdS0k4d_aV5jK0qx9f_XDkeEyVSYN1bWZaCO_ul1qGsMGWXs5vhQcGLzxnlboRLwd_MK_904Tycf" 
                className="absolute right-[-10%] bottom-[-10%] w-64 desktop:w-80 h-64 desktop:h-80 object-contain group-hover:scale-110 transition-all duration-700 ease-out"
                alt="Banner 2"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="hidden desktop:block relative h-80 rounded-3xl overflow-hidden bg-[#E6F4EA] p-10 group cursor-pointer shadow-premium"
            >
              <div className="relative z-10 max-w-[70%]">
                <h3 className="text-3xl font-black leading-[1.1] mb-4 text-[#0D3C26]">It's back! 30% off McCrispy & Spicy</h3>
                <p className="text-base font-bold mb-6 text-[#0D3C26]/70">Also enjoy 20% off V-cut Wedges</p>
                <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-black hover:bg-zinc-800 transition-all active:scale-95">Order McDonald's®</button>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhz1WoO9jgLRnz551ygQ_NfAr99Mpp6tv-LAJZ1OSjJEerQ89gvnZsTCRexeZLF1e2JwR_IW1oMZh4I0-vnf4dfvC8lE6SkVluCa5PGw1Wzpkf2DQrV8w6Eg-jdIC6kowO5ZTdq2VHEo4OGNxVxIATKXwYlik96UH26lZA9PJBKCEuPcUs4sCsJvWZG3_Ycs6L1i1jiCBxTQWqEcEsbVX8nGDRBBACt72lqERech5mLq_dQEaWYMfwt5eYadequU_lCgZ5OUyb1UYT" 
                className="absolute right-[-10%] bottom-[-10%] w-80 h-80 object-contain group-hover:scale-110 transition-all duration-700 ease-out"
                alt="Banner 3"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </section>

          {/* Speedy Deliveries */}
          <section className="space-y-8 mb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl desktop:text-3xl font-black tracking-tight">Speedy deliveries</h2>
              <div className="flex items-center gap-4">
                <button className="text-sm font-bold hover:underline underline-offset-4">See all</button>
                <div className="flex gap-3">
                  <button className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {loadingPartners ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">Loading partners...</p>
                </div>
              ) : partners.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">No partners available</p>
                </div>
              ) : (
                partners.concat(partners).map((restaurant, idx) => (
                  <motion.div 
                    key={`${restaurant.id}-${idx}`} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    onClick={() => {
                      console.log('Partner clicked:', restaurant);
                      setSelectedRestaurant(restaurant);
                    }}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-premium transition-all duration-500">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Heart className={`w-5 h-5 ${restaurant.isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-900'}`} />
                      </div>
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-lg">
                        Free Delivery
                      </div>
                    </div>
                    <div className="flex justify-between items-start px-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black truncate group-hover:text-emerald-600 transition-colors">{restaurant.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                          <div className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-md">
                            <span className="font-black text-zinc-900">{restaurant.rating}</span>
                            <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                          </div>
                          <span>•</span>
                          <span className="font-bold text-zinc-900">10–20 min</span>
                          <span>•</span>
                          <span>$0.99 Fee</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Today's Offers */}
          <section className="space-y-8 mb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl desktop:text-3xl font-black tracking-tight">Today's offers</h2>
              <div className="flex items-center gap-4">
                <button className="text-sm font-bold hover:underline underline-offset-4">See all</button>
                <div className="flex gap-3">
                  <button className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {loadingPartners ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">Loading offers...</p>
                </div>
              ) : partners.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-slate-500">No offers available</p>
                </div>
              ) : (
                partners.concat(partners).map((restaurant, idx) => (
                  <motion.div 
                    key={`offer-${restaurant.id}-${idx}`} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    onClick={() => {
                      console.log('Offer clicked:', restaurant);
                      setSelectedRestaurant(restaurant);
                    }}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-premium transition-all duration-500">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-lg">
                        Buy 1 get 1 free
                      </div>
                    </div>
                    <div className="flex justify-between items-start px-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black truncate group-hover:text-red-600 transition-colors">{restaurant.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                          <div className="flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded-md">
                            <span className="font-black text-zinc-900">{restaurant.rating}</span>
                            <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                          </div>
                          <span>•</span>
                          <span className="font-bold text-zinc-900">15–25 min</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Desktop Footer */}
          <footer className="mt-20 pt-20 border-t border-zinc-100">
            <div className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-4 gap-12 mb-20">
              <div className="space-y-6">
                <h1 className="text-3xl font-black tracking-tighter">Uber <span className="text-emerald-600">Eats</span></h1>
                <div className="flex gap-4">
                  <div className="w-32 h-10 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
                    <span className="text-white text-[10px] font-bold">App Store</span>
                  </div>
                  <div className="w-32 h-10 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
                    <span className="text-white text-[10px] font-bold">Google Play</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold mb-6">Get Help</h5>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Buy gift cards</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Add your restaurant</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Sign up to deliver</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Create a business account</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Promotions</p>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold mb-6">Restaurants Near Me</h5>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">View all cities</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">View all countries</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">Pickup near me</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">About Uber Eats</p>
                <p className="text-sm text-zinc-500 hover:text-black cursor-pointer transition-colors">English</p>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold mb-6">Socials</h5>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 cursor-pointer transition-colors">
                    <span className="font-bold text-xs">FB</span>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 cursor-pointer transition-colors">
                    <span className="font-bold text-xs">TW</span>
                  </div>
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 cursor-pointer transition-colors">
                    <span className="font-bold text-xs">IG</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-10 border-t border-zinc-100 text-[10px] desktop:text-xs text-zinc-400 font-medium">
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                <p className="hover:text-black cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-black cursor-pointer transition-colors">Terms</p>
                <p className="hover:text-black cursor-pointer transition-colors">Pricing</p>
                <p className="hover:text-black cursor-pointer transition-colors">Do not sell or share my personal information</p>
              </div>
              <p>© 2026 Uber Technologies Inc.</p>
            </div>
          </footer>
        </main>
      </div>

      <MobileNav basketCount={basketCount} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
