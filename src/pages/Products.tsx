import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '../data/products';
import { fetchProducts } from '../services/productService';
import { useSettings } from '../context/SettingsContext';

export default function Products() {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States based on URL params or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
      if (data.length > 0) {
        setMaxPrice(Math.max(...data.map(p => p.price)));
      }
      setIsLoading(false);
    }
    loadProducts();
  }, []);

  const { materials, styles, types, highestPrice } = useMemo(() => {
    return {
      materials: Array.from(new Set(products.map(p => p.material))),
      styles: Array.from(new Set(products.map(p => p.style))),
      types: Array.from(new Set(products.map(p => p.type))),
      highestPrice: products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000,
    };
  }, [products]);

  // Update local search state if URL changes (e.g. from navbar search)
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchQuery(query);
    }
    const type = searchParams.get('type');
    if (type !== null) {
      setSelectedType(type);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = selectedType === 'All' || product.type === selectedType;
      const matchMaterial = selectedMaterial === 'All' || product.material === selectedMaterial;
      const matchStyle = selectedStyle === 'All' || product.style === selectedStyle;
      const matchPrice = product.price <= maxPrice;

      return matchSearch && matchType && matchMaterial && matchStyle && matchPrice;
    });
  }, [products, searchQuery, selectedType, selectedMaterial, selectedStyle, maxPrice]);

  const closeProductModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const allImages = selectedProduct ? [selectedProduct.image, ...(selectedProduct.images || []).filter(Boolean)] : [];

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-paper pb-20 relative">
      
      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={closeProductModal}>
          <div className="bg-white max-w-4xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Image Gallery */}
            <div className="md:w-1/2 relative bg-gray-100 flex-shrink-0 flex items-center justify-center min-h-[300px]">
              <img 
                referrerPolicy="no-referrer"
                src={allImages[currentImageIndex]} 
                alt={`${selectedProduct.name} - view ${currentImageIndex + 1}`} 
                className="w-full h-full object-contain mix-blend-multiply max-h-[90vh]"
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white text-black transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-black' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Details */}
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col relative overflow-y-auto">
              <button onClick={closeProductModal} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={24} />
              </button>
              
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {selectedProduct.type} / {selectedProduct.material}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-black mb-4">{selectedProduct.name}</h2>
              <div className="text-xl font-light text-black mb-6">₹{selectedProduct.price.toLocaleString('en-IN')}</div>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-1">
                {selectedProduct.description}
              </p>
              
              <div className="space-y-4">
                 <div className="flex justify-between border-b border-gray-100 py-2">
                   <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Style</span>
                   <span className="text-sm font-medium">{selectedProduct.style}</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 py-2">
                   <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Material</span>
                   <span className="text-sm font-medium">{selectedProduct.material}</span>
                 </div>
              </div>
              
              <button 
                 onClick={closeProductModal}
                 className="w-full mt-8 bg-white border border-gray-200 text-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
               >
                 Close
              </button>
              
              <a 
                 href={`https://wa.me/${settings.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${selectedProduct.name} (Code: ${selectedProduct.id})`)}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full mt-3 bg-black text-white text-center py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors block"
               >
                 Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-black">Our Collection</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">Explore our carefully curated selection of timeless furniture, designed to bring elegance and comfort to your space.</p>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full mt-0 bg-white">
        <div className="flex flex-col lg:flex-row w-full">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-white p-4 border-b border-gray-100">
             <form onSubmit={handleSearchSubmit} className="relative flex-grow mr-4">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </form>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-gray-100 p-2 rounded transition-colors"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`lg:w-64 flex-shrink-0 p-8 border-r border-gray-100 bg-white ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-28 flex flex-col gap-10">
              <div className="flex justify-between items-center mb-0 lg:hidden">
                <h2 className="text-sm font-semibold text-black">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-black"><X size={20}/></button>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search collection..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if(e.target.value === '') {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('search');
                        setSearchParams(newParams);
                      }
                    }}
                    className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black focus:outline-none transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </form>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Category</h3>
                <ul className="space-y-3 text-sm font-medium">
                  {['All', ...types].map(type => (
                    <li key={type}>
                      <button 
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left flex justify-between transition-colors ${selectedType === type ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                      >
                        {type} <span className="text-gray-300 font-normal">{type === 'All' ? products.length : products.filter(p => p.type === type).length}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Material Filter */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Material</h3>
                <div className="flex flex-wrap gap-2">
                  {['All', ...materials].map(material => (
                    <button 
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`px-2 py-1 text-[10px] rounded-sm transition-colors border ${
                        selectedMaterial === material 
                          ? 'bg-black text-white border-black' 
                          : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Style</h3>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-xs rounded focus:outline-none focus:border-black"
                >
                  <option value="All">All Styles</option>
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Max Price</h3>
                <div className="flex items-center gap-2 text-xs mb-4">
                  <span className="text-gray-300">₹0</span>
                  <input 
                    type="range" 
                    min="0" 
                    max={highestPrice} 
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-black appearance-none bg-gray-200 h-1 rounded-full outline-none"
                  />
                  <span className="text-black font-semibold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-auto border-t border-gray-100 pt-6">
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('All');
                    setSelectedMaterial('All');
                    setSelectedStyle('All');
                    setMaxPrice(100000);
                    setSearchParams(new URLSearchParams());
                  }}
                  className="w-full py-2 text-[10px] uppercase tracking-widest font-bold border border-gray-200 text-gray-500 rounded-sm hover:bg-black hover:text-white hover:border-black transition-colors"
                >
                   Clear Filters
                 </button>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-8 bg-[#FAFAFA]">
            <div className="mb-6 flex justify-between items-end">
               <h2 className="text-sm font-semibold text-black">Showing {filteredProducts.length} Results</h2>
            </div>

            {isLoading ? (
               <p className="text-sm text-gray-500">Loading collection...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-bold tracking-tighter text-black mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-black transition-colors">{product.name}</h4>
                        <p className="text-xs text-gray-400 mb-1 italic">{product.type}, {product.material}</p>
                      </div>
                      <span className="text-sm font-light text-black">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
