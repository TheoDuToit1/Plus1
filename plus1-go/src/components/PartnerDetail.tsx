import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus,
  Search,
  Award,
  Calendar,
  ChefHat,
  X,
  CheckCircle2,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  is_available: boolean;
}

interface BasketItem extends MenuItem {
  quantity: number;
}

interface Partner {
  id: string;
  shop_name: string;
  category: string;
  address: string;
  rating: number;
  total_reviews: number;
  average_prep_time_minutes: number;
  store_banner_url?: string;
  store_logo_url?: string;
  delivery_radius_km: number;
  cashback_percent: number;
  minimum_order_value: number;
}

interface ProductCategory {
  id: string;
  name: string;
  display_order: number;
}

export default function PartnerDetail({ partnerId, onBack }: { partnerId: string; onBack: () => void }) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [loading, setLoading] = useState(true);

  // Fetch partner and menu data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch partner details
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .select('*')
          .eq('id', partnerId)
          .single();

        if (partnerError) throw partnerError;
        setPartner(partnerData);

        // Fetch product categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('partner_id', partnerId)
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        if (categoriesData && categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }

        // Fetch products/menu items
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('partner_id', partnerId)
          .eq('is_available', true);

        if (productsError) throw productsError;
        setMenuItems(productsData || []);
      } catch (error) {
        console.error('Error fetching partner data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToBasket = (item: MenuItem) => {
    setBasket(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromBasket = (id: string) => {
    setBasket(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const basketTotal = useMemo(() => basket.reduce((sum, item) => sum + (item.price * item.quantity), 0), [basket]);
  
  const filteredItems = useMemo(() => 
    menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !activeCategory || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    }), [menuItems, searchQuery, activeCategory]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowCheckoutModal(false);
      setBasket([]);
      // In a real app, redirect to success page
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 font-medium mb-4">Partner not found</p>
          <button
            onClick={onBack}
            className="bg-primary text-white px-6 py-2 rounded-[9px] font-black text-sm uppercase tracking-widest"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white text-primary font-sans selection:bg-secondary selection:text-white pb-32 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white min-h-screen relative">
          {/* Mobile Header - Uber Style */}
          <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100 max-w-2xl mx-auto">
            <button 
              onClick={onBack}
              className="h-10 w-10 rounded-full flex items-center justify-center text-primary hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Delivery to</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-black">Madison Ave, NY</span>
                <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Minus size={12} className="rotate-90" />
                </motion.div>
              </div>
            </div>
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-primary">
              <Search size={24} />
            </button>
          </header>

          {/* Mobile Content */}
          <main className="pt-20">
          {/* Hero Image - Uber Style */}
          <section className="relative h-64 w-full overflow-hidden">
            <img 
              src={partner.store_banner_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"} 
              className="w-full h-full object-cover" 
              alt="Restaurant"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </section>

          {/* Restaurant Info - Uber Style */}
          <section className="px-6 py-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-black tracking-tighter text-primary">{partner.shop_name}</h1>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${isLiked ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-50 border-slate-100 text-primary'}`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-primary">{partner.rating}</span>
                <span>({partner.total_reviews}+ ratings)</span>
              </div>
              <span>•</span>
              <span>{partner.category}</span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full whitespace-nowrap">
                <Clock size={14} className="text-primary" />
                <span className="text-xs font-black">{partner.average_prep_time_minutes}–{partner.average_prep_time_minutes + 15} min</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full whitespace-nowrap">
                <Award size={14} className="text-secondary" />
                <span className="text-xs font-black">{partner.cashback_percent}% Cashback</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full whitespace-nowrap">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-xs font-black">{partner.delivery_radius_km} km</span>
              </div>
            </div>
          </section>

          {/* Chef's Picks - Uber Style Stories */}
          <section className="py-6 border-t border-slate-50">
            <div className="px-6 mb-4 flex justify-between items-end">
              <h3 className="text-lg font-black tracking-tight">Chef's Picks</h3>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">See all</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6">
              {[
                { img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=300&auto=format&fit=crop", name: "Fresh Herbs", price: "$4.00" },
                { img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop", name: "Plating Art", price: "$12.00" },
                { img: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=300&auto=format&fit=crop", name: "Daily Dessert", price: "$9.00" }
              ].map((pick, i) => (
                <div key={i} className="flex-shrink-0 w-40 space-y-2">
                  <div className="h-40 w-40 rounded-[9px] overflow-hidden shadow-sm border border-slate-100">
                    <img src={pick.img} className="h-full w-full object-cover" alt={pick.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-xs font-black truncate">{pick.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{pick.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category Tabs - Uber Style */}
          <section className="sticky top-[72px] z-40 bg-white border-b border-slate-100">
            <div className="flex gap-8 overflow-x-auto no-scrollbar px-6 py-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all relative pb-2 ${
                    activeCategory === cat.id ? 'text-primary' : 'text-slate-400'
                  }`}
                >
                  {cat.name}
                  {activeCategory === cat.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Menu Items - Uber Eats List Style */}
          <section className="px-6 py-8 space-y-10">
            <h3 className="text-2xl font-black tracking-tighter">{categories.find(c => c.id === activeCategory)?.name || 'Menu'}</h3>
            <div className="space-y-8">
              {filteredItems.map(item => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 pb-8 border-b border-slate-50 last:border-0"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black tracking-tight">{item.name}</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 font-medium">{item.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-black">${(item.price / 100).toFixed(2)}</span>
                      <motion.button 
                        layout
                        initial={false}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          width: basket.find(i => i.id === item.id) ? 46 : 110 
                        }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => addToBasket(item)}
                        className={`h-10 rounded-[9px] flex items-center justify-center transition-colors overflow-hidden relative shadow-sm ${
                          basket.find(i => i.id === item.id) 
                            ? 'bg-secondary text-white' 
                            : 'bg-slate-50 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        <AnimatePresence mode="wait">
                          {basket.find(i => i.id === item.id) ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle2 size={20} />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="add"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 px-3 whitespace-nowrap"
                            >
                              <Plus size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                  <div className="h-24 w-24 rounded-[9px] overflow-hidden flex-shrink-0 shadow-md">
                    <img src={item.image_url || "https://via.placeholder.com/96?text=Item"} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Mobile Bottom Bar - Uber Style */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-4 bg-white border-t border-slate-100 max-w-2xl mx-auto">
          <AnimatePresence>
            {basket.length > 0 && (
              <motion.button 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={() => setShowCheckoutModal(true)}
                className="w-full bg-primary text-white h-14 rounded-[9px] flex items-center justify-between px-6 shadow-xl active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-[9px] bg-white/20 flex items-center justify-center font-black text-xs">
                    {basket.reduce((s, i) => s + i.quantity, 0)}
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">View Basket</span>
                </div>
                <span className="font-black text-base tracking-tighter">${(basketTotal + 1.99).toFixed(2)}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Checkout Drawer - Uber Style */}
        <AnimatePresence>
          {showCheckoutModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end justify-center"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isCheckingOut && setShowCheckoutModal(false)} />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative bg-white w-full rounded-t-[9px] p-8 pb-12 shadow-2xl"
              >
                {!isCheckingOut ? (
                  <div className="space-y-8">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-2" />
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black tracking-tighter">Your Basket</h2>
                      <button onClick={() => setShowCheckoutModal(false)} className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <X size={20} />
                      </button>
                    </div>

            <div className="max-h-[350px] overflow-y-auto space-y-4 no-scrollbar">
                      {basket.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                          <div className="flex gap-4 items-center">
                            <span className="h-8 w-8 rounded-[9px] bg-slate-50 flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                            <div>
                              <p className="font-black text-sm">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromBasket(item.id)} className="h-8 w-8 rounded-[9px] bg-slate-50 flex items-center justify-center text-slate-400"><Minus size={14} /></button>
                            <button onClick={() => addToBasket(item)} className="h-8 w-8 rounded-[9px] bg-slate-50 flex items-center justify-center text-slate-400"><Plus size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Subtotal</span>
                        <span className="text-primary">${basketTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-2xl pt-4">
                        <span className="font-black tracking-tighter">Total</span>
                        <span className="font-black tracking-tighter text-secondary">${(basketTotal + 1.99).toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full py-5 bg-primary text-white rounded-[9px] font-black text-lg uppercase tracking-widest shadow-xl"
                    >
                      Place Order
                    </button>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-20 w-20 rounded-full border-4 border-slate-100 border-t-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-black tracking-tight">Processing Order</h2>
                      <p className="text-sm text-slate-400 max-w-[240px] mx-auto">Securing your Michelin-starred experience...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-primary">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={partner.store_banner_url || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"} 
          alt="Restaurant Interior"
          className="h-full w-full object-cover brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
          <button 
            onClick={onBack}
            className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-4">
            <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <Share2 size={24} />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`h-12 w-12 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isLiked ? 'bg-red-500 border-red-400 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-black/20 to-transparent text-white">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mb-6"
            >
              <span className="px-3 py-1 bg-secondary text-[11px] font-black uppercase tracking-[0.2em] rounded-full">Michelin Guide</span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-[0.2em] rounded-full">Fine Dining</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
            >
              {partner.shop_name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-8 text-sm font-bold uppercase tracking-widest opacity-80"
            >
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span>{partner.rating} ({partner.total_reviews}+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{partner.average_prep_time_minutes}–{partner.average_prep_time_minutes + 15} min</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{partner.address}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fees & Quick Info Bar */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-wrap justify-between items-center gap-6">
          <div className="flex flex-wrap gap-6 sm:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Delivery</p>
              <p className="text-sm sm:text-base font-black text-secondary">Free</p>
            </div>
            <div className="h-10 w-px bg-slate-100 self-center hidden sm:block" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Min. Order</p>
              <p className="text-sm sm:text-base font-black">${(partner.minimum_order_value / 100).toFixed(2)}</p>
            </div>
            <div className="h-10 w-px bg-slate-100 self-center hidden md:block" />
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Cashback</p>
              <p className="text-sm sm:text-base font-black text-secondary">{partner.cashback_percent}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-[9px] py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-start">
          
          {/* Menu & Info Section */}
          <div className="flex-1 space-y-20">
            
            {/* About Section - Editorial Style */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.3em]">
                  <ChefHat size={16} />
                  <span>{partner.category} Cuisine</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter">{partner.shop_name}</h2>
                <p className="text-slate-500 leading-relaxed text-lg italic">
                  "We believe that every delivery should be an event. Our kitchen uses only the finest seasonal ingredients, sourced directly from local artisans."
                </p>
                <div className="flex gap-8 pt-4">
                  <div className="flex flex-col gap-1">
                    <Award className="text-yellow-500" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.rating} Rating</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Calendar className="text-blue-500" size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{partner.total_reviews} Reviews</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full rounded-[9px] overflow-hidden shadow-sm border border-slate-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293414164!2d-73.9658!3d40.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2589a01853145%3A0x5ca05c951eeed526!2sMadison%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1648395333333!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </section>

            {/* Popular Items Carousel */}
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Most Popular</h3>
              <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar">
                {menuItems.slice(0, 3).map(item => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[300px] bg-primary rounded-[9px] p-6 text-white flex flex-col justify-between h-[240px] relative overflow-hidden group cursor-pointer"
                  >
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-2 leading-tight">{item.name}</h4>
                      <p className="text-xs opacity-60 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                      <span className="text-2xl font-black">${(item.price / 100).toFixed(2)}</span>
                      <button 
                        onClick={() => addToBasket(item)}
                        className="h-12 w-12 rounded-full bg-white text-primary flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" 
                        alt={item.name}
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Menu Section */}
            <div className="space-y-12">
              {/* Category Tabs */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-8 py-3 rounded-[9px] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-primary text-white shadow-2xl shadow-slate-300' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Menu Groups */}
              <div className="space-y-20">
                {categories.map((category) => {
                  const items = filteredItems.filter(i => i.category === category.id);
                  if (items.length === 0 && searchQuery) return null;
                  
                  return (
                    <section key={category.id} id={category.name.toLowerCase()}>
                      <div className="flex justify-between items-end mb-10 border-b-2 border-slate-50 pb-6">
                        <h2 className="text-4xl font-black tracking-tighter">{category.name}</h2>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{items.length} options</span>
                      </div>
                      
                      {items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {items.map((item) => (
                            <motion.div 
                              key={item.id}
                              whileHover={{ y: -8 }}
                              className="group bg-white border border-slate-100 rounded-[9px] p-6 flex gap-6 hover:shadow-2xl hover:shadow-slate-100 transition-all cursor-pointer"
                            >
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-black text-xl tracking-tight group-hover:text-secondary transition-colors">{item.name}</h3>
                                  </div>
                                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 leading-relaxed font-medium">{item.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-black text-2xl tracking-tighter">${(item.price / 100).toFixed(2)}</span>
                                  <motion.button 
                                    layout
                                    initial={false}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ 
                                      width: basket.find(i => i.id === item.id) ? 46 : 136 
                                    }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      addToBasket(item);
                                    }}
                                    className={`h-12 rounded-[9px] flex items-center justify-center transition-colors overflow-hidden relative shadow-sm ${
                                      basket.find(i => i.id === item.id) 
                                        ? 'bg-secondary text-white' 
                                        : 'bg-slate-50 text-primary hover:bg-primary hover:text-white'
                                    }`}
                                  >
                                    <AnimatePresence mode="wait">
                                      {basket.find(i => i.id === item.id) ? (
                                        <motion.div
                                          key="check"
                                          initial={{ scale: 0, rotate: -45 }}
                                          animate={{ scale: 1, rotate: 0 }}
                                          exit={{ scale: 0 }}
                                          className="flex items-center justify-center"
                                        >
                                          <CheckCircle2 size={24} />
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="add"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="flex items-center gap-2 px-4 whitespace-nowrap"
                                        >
                                          <Plus size={20} />
                                          <span className="text-xs font-black uppercase tracking-widest">Add to Cart</span>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.button>
                                </div>
                              </div>
                              {item.image_url && (
                                <div className="w-32 h-32 rounded-[9px] overflow-hidden flex-shrink-0 shadow-lg">
                                  <img 
                                    src={item.image_url} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-20 text-center bg-slate-50 rounded-[9px] border-2 border-dashed border-slate-100">
                          <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No items found</p>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Basket */}
          <aside className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-20 lg:self-start">
              <div className="bg-slate-50 rounded-[9px] p-10 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black tracking-tight">Your Order</h2>
                  <div className="h-12 w-12 rounded-[9px] bg-white flex items-center justify-center text-primary shadow-sm">
                    <ShoppingBag size={24} />
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {basket.length > 0 ? (
                    <div className="space-y-8">
                      <div className="max-h-[450px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
                        {basket.map((item) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.7, ease: [0.79, 0.01, 0.22, 1] } }}
                            key={item.id} 
                            className="flex justify-between items-center bg-white p-4 rounded-[9px] border border-slate-100 shadow-sm group overflow-hidden"
                          >
                            <div className="flex gap-4 items-center flex-1">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.79, 0.01, 0.22, 1] }}
                                className="w-16 h-16 rounded-full bg-slate-50 overflow-hidden flex-shrink-0"
                              >
                                <img src={item.image_url || "https://via.placeholder.com/64?text=Item"} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                              </motion.div>
                              <div className="flex-1">
                                <motion.p 
                                  initial={{ opacity: 0, x: 30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.7 }}
                                  className="font-black text-sm tracking-tight"
                                >
                                  {item.name}
                                </motion.p>
                                <motion.p 
                                  initial={{ opacity: 0, x: 30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.85 }}
                                  className="text-xs font-bold text-slate-400 mt-0.5"
                                >
                                  ${(item.price * item.quantity).toFixed(2)}
                                </motion.p>
                              </div>
                            </div>
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4, delay: 1 }}
                              className="flex items-center gap-3 bg-slate-50 rounded-[9px] p-1"
                            >
                              <button 
                                onClick={() => removeFromBasket(item.id)}
                                className="h-8 w-8 rounded-[9px] bg-white flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => addToBasket(item)}
                                className="h-8 w-8 rounded-[9px] bg-white flex items-center justify-center text-slate-400 hover:text-secondary transition-colors shadow-sm"
                              >
                                <Plus size={16} />
                              </button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="pt-8 border-t-2 border-slate-200 space-y-4">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                          <span className="text-primary">${basketTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">Delivery</span>
                          <span className="text-secondary uppercase tracking-widest">Free</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-400 uppercase tracking-widest">Service Fee</span>
                          <span className="text-primary">$1.99</span>
                        </div>
                        <div className="flex justify-between text-2xl pt-6 border-t-2 border-slate-100">
                          <span className="font-black tracking-tighter">Total</span>
                          <span className="font-black tracking-tighter">${(basketTotal + 1.99).toFixed(2)}</span>
                        </div>
                      </div>

                      <label className="order-wrapper w-full flex justify-center">
                        <input type="checkbox" id="order-toggle" hidden onChange={(e) => {
                          if (e.target.checked) {
                            setTimeout(() => setShowCheckoutModal(true), 7000);
                          }
                        }} />
                        <span className="order">
                          <span className="default">Click To Finish Checkout</span>
                          <span className="success">
                            En Route
                            <svg viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span>
                          <div className="box"></div>
                          <div className="truck">
                            <div className="back"></div>
                            <div className="front">
                              <div className="window"></div>
                            </div>
                            <div className="light top"></div>
                            <div className="light bottom"></div>
                          </div>
                          <div className="lines"></div>
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="h-24 w-24 rounded-[9px] bg-white flex items-center justify-center text-slate-100 shadow-inner">
                        <ShoppingBag size={48} />
                      </div>
                      <div>
                        <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-sm">Basket is Empty</p>
                        <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto leading-relaxed">Select items from our Michelin-starred menu to begin your experience.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hours Card */}
              <div className="mt-8 bg-white rounded-[9px] p-8 border border-slate-100 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Opening Hours</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Mon – Thu</span>
                    <span>12:00 – 22:00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Fri – Sat</span>
                    <span className="text-secondary">12:00 – 00:00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Sunday</span>
                    <span>11:00 – 21:00</span>
                  </div>
                </div>
              </div>

          </aside>
        </div>
      </main>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCheckingOut && setShowCheckoutModal(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[9px] p-10 shadow-2xl overflow-hidden"
            >
              {!isCheckingOut ? (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tighter">Confirm Order</h2>
                    <button 
                      onClick={() => setShowCheckoutModal(false)}
                      className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[9px] border border-slate-100">
                      <div className="h-10 w-10 rounded-[9px] bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-black text-sm">Premium Delivery</p>
                        <p className="text-xs text-slate-500 mt-0.5">Your order will be handled with white-glove service.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Summary</p>
                      <div className="max-h-32 overflow-y-auto space-y-2 pr-2 no-scrollbar">
                        {basket.map(item => (
                          <div key={item.id} className="flex justify-between text-sm font-bold">
                            <span className="text-slate-500">{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-lg font-black tracking-tighter">Total Amount</span>
                      <span className="text-2xl font-black tracking-tighter">${(basketTotal + 1.99).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCheckoutModal(false)}
                      className="flex-1 py-4 bg-slate-50 text-primary rounded-[9px] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCheckout}
                      className="flex-1 py-4 bg-primary text-white rounded-[9px] font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-200"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-primary"
                    />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">Processing Order</h2>
                    <p className="text-sm text-slate-400 max-w-[240px] mx-auto leading-relaxed">Securing your Michelin-starred experience. Our kitchen is preparing for your arrival.</p>
                  </div>
                  <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-primary text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <h2 className="text-3xl font-black tracking-tighter">{partner.shop_name}</h2>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Experience {partner.category} cuisine delivered to your doorstep. Our commitment to quality and service ensures a 5-star dining experience every time.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Twitter', 'Facebook'].map(social => (
                  <a key={social} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-slate-400 rounded-sm" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Quick Links</h3>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Chefs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Awards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Support</h3>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Delivery Areas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">© 2026 {partner.shop_name}. Premium Delivery Experience.</p>
            <div className="flex gap-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-20 grayscale" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-20 grayscale" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-20 grayscale" alt="Paypal" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
