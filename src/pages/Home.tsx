import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../data/products';
import { fetchProducts } from '../services/productService';
import { useSettings } from '../context/SettingsContext';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setFeaturedProducts(data.slice(0, 3));
    }
    loadProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex text-black overflow-hidden bg-[#FAFAFA] border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <img 
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
            alt="Beautiful minimal living room" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        
        {/* Content Box over image */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl bg-white/90 backdrop-blur-md p-10 md:p-12 border border-gray-100 md:translate-y-8 rounded-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 block">Est. {settings.estDate}</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-6 text-black">
              Multi brand <br />
              furniture.
            </h1>
            <p className="text-gray-500 mb-8 max-w-md text-sm leading-relaxed">
              Welcome to the premier multi-brand furniture store. We are the one and only authorized distributor of Nilkamal in North East India, bringing you exceptional quality and variety.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Shop Collection <ArrowRight size={14} />
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Authorized Nilkamal Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="aspect-[3/4] w-full max-w-md mx-auto overflow-hidden bg-gray-100 rounded-sm">
                 <img 
                   referrerPolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=800" 
                   alt="Craftsmanship" 
                   className="w-full h-full object-cover"
                 />
               </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-black">
                Unmatched Variety & Quality
              </h2>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                As the leading multi-brand furniture store in the region, SB Enterprise brings the widest selection of premium home and office furniture under one roof. We pride ourselves on curating pieces that blend functionality with exceptional design.
              </p>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                We are incredibly proud to be the exclusive, one and only authorized distributor of <b>Nilkamal</b> in North East India. From elegant living room sets to durable plastic furniture and intelligent storage solutions, our partnership guarantees authentic products at the best prices.
              </p>
              <Link to="/contact" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                Visit Our Showroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-3 block">Curated Selection</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Featured Pieces</h2>
            </div>
            <Link to="/products" className="mt-6 md:mt-0 text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
               View All Products
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12">Loading collection...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <Link to={`/products?search=${product.name}`} key={product.id} className="group cursor-pointer block">
                  <div className="aspect-[4/5] bg-gray-200 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#E8E6E3] flex items-center justify-center text-gray-400 text-sm">
                        <img 
                          referrerPolicy="no-referrer"
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold">{product.name}</h4>
                  <p className="text-xs text-gray-400 mb-1 italic">{product.material}, {product.style}</p>
                  <p className="text-sm font-light">₹{product.price.toLocaleString('en-IN')}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
