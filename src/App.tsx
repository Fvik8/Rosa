/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coffee, Flower2, Instagram, MapPin, Menu as MenuIcon, Plus, Search, ShoppingBag, Trash2, X, Minus } from "lucide-react";
import { useState, useRef, useMemo, type RefObject } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const IMAGE_BASE_URL = "https://raw.githubusercontent.com/Fvik8/Rosa/main/Images/";

// --- Types ---

interface Product {
  id: string;
  title: string;
  price: number;
  url: string;
  category: "plant" | "cafe";
}

interface CartItem extends Product {
  quantity: number;
}

// --- Components ---

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove,
  onUpdateQuantity 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[]; 
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-rosa-charcoal/20 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-serif text-3xl font-light">Your Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-rosa-cream rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
                  <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
                  <p className="font-serif italic text-lg text-rosa-charcoal">Your bag is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-24 bg-rosa-beige rounded-sm overflow-hidden flex-shrink-0 hand-drawn-border p-1">
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover rounded-sm" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-lg leading-tight">{item.title}</h4>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-rosa-charcoal/30 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 border border-rosa-charcoal/10 rounded-full px-2 py-1">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-rosa-green"><Minus size={12}/></button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-rosa-green"><Plus size={12}/></button>
                        </div>
                        <span className="font-sans text-xs font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-8 pt-8 border-t border-rosa-charcoal/10">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">Total</span>
                  <span className="text-3xl font-serif">£{total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-rosa-charcoal text-white py-5 rounded-sm hover:bg-rosa-green transition-all uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-rosa-charcoal/10">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ... (Navbar и Hero компонентите остават същите като в предишния отговор) ...
const Navbar = ({ 
  onSearchIconClick, 
  cartCount, 
  onBagClick 
}: { 
  onSearchIconClick: () => void;
  cartCount: number;
  onBagClick: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-rosa-cream/80 backdrop-blur-md border-b border-rosa-charcoal/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="#" className="font-serif text-2xl tracking-widest uppercase font-semibold text-rosa-charcoal">Rosa</a>
          <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-rosa-charcoal/70">
            <a href="#about" className="hover:text-rosa-green transition-colors">The Story</a>
            <a href="#menu" className="hover:text-rosa-green transition-colors">The Cafe</a>
            <a href="#gallery" className="hover:text-rosa-green transition-colors">The Gallery</a>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={onSearchIconClick}
            className="text-rosa-charcoal/60 hover:text-rosa-green transition-colors flex items-center gap-2 group"
          >
            <Search size={18} />
            <span className="text-[10px] uppercase font-medium tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Search</span>
          </button>
          <button 
            onClick={onBagClick}
            className="w-10 h-10 border border-rosa-charcoal rounded-full flex items-center justify-center cursor-pointer hover:bg-rosa-charcoal hover:text-white transition-all relative"
          >
            <span className="text-[10px] uppercase font-medium">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rosa-green text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-rosa-cream border-b border-rosa-charcoal/10 p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#about" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest font-serif">The Story</a>
            <a href="#menu" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest font-serif">The Cafe</a>
            <a href="#gallery" onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest font-serif">The Gallery</a>
            <button onClick={() => { onBagClick(); setIsOpen(false); }} className="text-sm uppercase tracking-widest font-serif flex items-center gap-2">
              Your Bag ({cartCount})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={targetRef} className="relative h-screen flex items-center px-6 lg:px-12 bg-rosa-cream overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-rosa-green/10 text-rosa-green-dark rounded-full text-[10px] uppercase tracking-widest w-fit"
          >
            Marylebone, London
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-rosa-charcoal text-6xl lg:text-8xl font-serif leading-[0.95] font-light"
          >
            A <span className="italic">green oasis</span> <br /> for the urban <br /> soul.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg font-light opacity-80 max-w-md leading-relaxed"
          >
            Bespoke botanical arrangements paired with artisan coffee. Designed for plant parents and coffee connoisseurs alike.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <a href="#gallery" className="bg-rosa-charcoal text-white px-10 py-5 text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-rosa-green transition-colors text-center inline-block">
              Order Flowers
            </a>
            <a href="#menu" className="border border-rosa-charcoal text-rosa-charcoal px-10 py-5 text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-rosa-charcoal hover:text-white transition-all text-center inline-block">
              View Menu
            </a>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity, y }}
          className="w-full md:w-1/2 h-[500px] lg:h-[600px] relative"
        >
          <div className="absolute inset-0 bg-rosa-beige hand-drawn-border sketch-shadow overflow-hidden leaf-pattern">
            <div className="absolute inset-6 bg-rosa-green/20 rounded-t-full border border-rosa-charcoal/20 flex items-end justify-center pb-12 overflow-hidden">
               <img
                src={`${IMAGE_BASE_URL}Mockup%20branding.png`}
                alt="Rosa Interior"
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
              />
              <svg width="200" height="300" viewBox="0 0 100 150" className="opacity-40 relative z-10">
                <path d="M50 140 Q50 70 50 10 M50 50 Q80 30 90 60 M50 80 Q20 60 10 90 M50 110 Q70 100 80 130" stroke="#2C2C2C" fill="none" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 hand-drawn-border w-52 sketch-shadow">
            <p className="font-serif text-sm italic">"The best matcha latte in W1U."</p>
            <p className="text-[10px] uppercase tracking-tighter mt-2 opacity-50">— Vogue London</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SectionHeading = ({ subtitle, title, centered = true }: { subtitle: string, title: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <span className="text-rosa-green-dark font-sans text-[10px] uppercase tracking-[0.3em] block mb-4">{subtitle}</span>
    <h2 className="text-4xl md:text-5xl font-serif text-rosa-charcoal leading-[1.1] font-light">{title}</h2>
  </div>
);

const AboutSection = () => (
  <section id="about" className="py-32 px-6 lg:px-12 bg-rosa-cream">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-sm sketch-shadow hand-drawn-border overflow-hidden bg-rosa-beige leaf-pattern p-4">
            <img 
              src={`${IMAGE_BASE_URL}Monstera%20Deliciosa.png`} 
              alt="Lush green plants" 
              className="w-full h-full object-cover rounded-sm border border-rosa-charcoal/20"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
        
        <div>
          <SectionHeading subtitle="The Narrative" title="A haven for London's plant parents" centered={false} />
          <div className="space-y-6 text-lg font-light opacity-80 leading-relaxed max-w-md">
            <p>
              Rosa was born from a simple dream: to create a sanctuary where the hustle of London fades into the rustle of leaves and the aroma of freshly roasted beans. 
            </p>
            <p>
              We believe that every home deserves a touch of nature. Our boutique curates the finest boutique plants and exotic blooms, paired perfectly with our artisanal coffee roasted in small batches right here in the city.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MenuSection = ({ onAdd }: { onAdd: (item: Product) => void }) => {
  const menuData: Product[] = [
    { id: "m1", title: "Rose & Pistachio Latte", price: 5.50, url: `${IMAGE_BASE_URL}Rose%20%26%20Pistachio%20Latte.png`, category: "cafe" },
    { id: "m2", title: "Hibiscus Cold Brew", price: 4.50, url: `${IMAGE_BASE_URL}Hibiscus%20Cold%20Brew.png`, category: "cafe" },
    { id: "m3", title: "Wildflower Honey Latte", price: 4.80, url: `${IMAGE_BASE_URL}Wildflower%20Honey%20Latte.png`, category: "cafe" },
    { id: "m4", title: "Avocado on Seeded Rye", price: 12.00, url: `${IMAGE_BASE_URL}Avocado%20on%20Seeded%20Rye.png`, category: "cafe" }
  ];

  return (
    <section className="grid md:grid-cols-3 border-t border-rosa-charcoal/10 min-h-[300px] bg-white">
      <div id="menu" className="p-12 border-r border-rosa-charcoal/10 flex flex-col justify-center">
        <h3 className="text-[10px] uppercase tracking-widest text-rosa-green-dark mb-8">The Cafe Menu</h3>
        <ul className="space-y-6 font-serif">
          {menuData.map((item) => (
            <li key={item.id} className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-xl group-hover:text-rosa-green transition-colors">{item.title}</span>
                <span className="text-xs italic opacity-40">House Specialty</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="opacity-50 font-sans text-xs">£{item.price.toFixed(2)}</span>
                {/* БУТОН ЗА ДОБАВЯНЕ */}
                <button 
                  onClick={() => onAdd(item)}
                  className="w-8 h-8 rounded-full border border-rosa-charcoal/10 flex items-center justify-center hover:bg-rosa-green hover:text-white transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div id="gallery-preview" className="p-12 border-r border-rosa-charcoal/10 flex flex-col justify-center bg-rosa-cream">
        <h3 className="text-[10px] uppercase tracking-widest text-rosa-green-dark mb-8">The Collection</h3>
        <div className="grid grid-cols-2 gap-4 flex-1">
          {menuData.map(item => (
            <div key={`img-${item.id}`} className="hand-drawn-border sketch-shadow overflow-hidden bg-white p-1 group relative">
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover rounded-sm opacity-80"
              />
              <button 
                onClick={() => onAdd(item)}
                className="absolute inset-0 bg-rosa-green/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-12 bg-rosa-green text-white flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest opacity-80 mb-4">Identity</h3>
          <p className="text-xl font-serif italic">Sustainable materials, hand-drawn lines.</p>
        </div>
      </div>
    </section>
  );
};

const GallerySection = ({ 
  searchRef, 
  onAdd 
}: { 
  searchRef?: RefObject<HTMLInputElement | null>;
  onAdd: (item: Product) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const plants: Product[] = [
    { id: "p1", url: `${IMAGE_BASE_URL}Monstera%20Deliciosa.png`, title: "Monstera Deliciosa", price: 35.00, category: "plant" },
    { id: "p2", url: `${IMAGE_BASE_URL}White%20Orchid%20Bouquet.png`, title: "White Orchid Bouquet", price: 42.00, category: "plant" },
    { id: "p3", url: `${IMAGE_BASE_URL}Peace%20Lily.png`, title: "Peace Lily", price: 28.00, category: "plant" },
    { id: "p4", url: `${IMAGE_BASE_URL}Succulent%20Terrarium.png`, title: "Succulent Terrarium", price: 24.00, category: "plant" }
  ];

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => 
      plant.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, plants]);

  return (
    <section id="gallery" className="py-32 px-6 lg:px-12 bg-rosa-cream">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Curated Greenery" title="Selected for the Modern Home" />
        
        <div className="max-w-md mx-auto mb-16 relative">
          <input 
            ref={searchRef as RefObject<HTMLInputElement>}
            type="text"
            placeholder="Search our collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-rosa-charcoal/20 py-4 pl-10 focus:outline-none focus:border-rosa-green font-serif italic text-lg"
          />
          <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-rosa-charcoal/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPlants.map((plant) => (
            <div key={plant.id} className="group relative">
              <div className="aspect-[3/4] rounded-sm hand-drawn-border sketch-shadow overflow-hidden mb-6 bg-rosa-beige p-2">
                <img src={plant.url} alt={plant.title} className="w-full h-full object-cover rounded-sm group-hover:scale-105 transition-transform duration-700" />
                <button 
                  onClick={() => onAdd(plant)}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full text-[10px] uppercase font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rosa-green hover:text-white flex items-center gap-2"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
              <div className="flex justify-between items-center px-1">
                <h4 className="font-serif text-xl font-light">{plant.title}</h4>
                <span className="text-rosa-green-dark opacity-60 text-xs">£{plant.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="visit" className="bg-rosa-cream pt-32 pb-12 px-6 lg:px-12 border-t border-rosa-charcoal/10">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="font-serif text-5xl mb-8 text-rosa-charcoal font-light">Rosa.</h2>
      <p className="text-[10px] uppercase tracking-widest opacity-30">© 2024 Rosa Boutique Ltd.</p>
    </div>
  </footer>
);

export default function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
        }
        return item;
    }));
  };

  return (
    <div className="min-h-screen font-sans selection:bg-rosa-green/20 overflow-x-hidden">
      <Navbar 
        onSearchIconClick={() => searchInputRef.current?.focus()} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onBagClick={() => setIsCartOpen(true)} 
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateQuantity}
      />

      <Hero />
      <AboutSection />
      <MenuSection onAdd={addToCart} />
      <GallerySection searchRef={searchInputRef} onAdd={addToCart} />
      <Footer />
    </div>
  );
}
