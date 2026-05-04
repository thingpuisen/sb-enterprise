import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Product } from '../data/products';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import { fetchSettings, updateSettings, SiteSettings } from '../services/settingsService';
import { Plus, Edit2, Trash2, LogOut, Settings as SettingsIcon, Package, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'settings'>('inventory');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [filterType, setFilterType] = useState('All');
  const [filterMaterial, setFilterMaterial] = useState('All');
  const [filterStyle, setFilterStyle] = useState('All');
  
  const { settings, refreshSettings } = useSettings();
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [categories, setCategories] = useState<string[]>(settings.categories || []);
  const [materials, setMaterials] = useState<string[]>(settings.materials || []);
  const [styles, setStyles] = useState<string[]>(settings.styles || []);
  
  const [newCategory, setNewCategory] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newStyle, setNewStyle] = useState('');
  
  const [editingCategory, setEditingCategory] = useState<{index: number, value: string} | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<{index: number, value: string} | null>(null);
  const [editingStyle, setEditingStyle] = useState<{index: number, value: string} | null>(null);
  
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const [formData, setFormData] = useState<Product>({
    id: '', name: '', price: 0, material: '', style: '', type: '', image: '', description: '', images: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showNotification = (message: string, type: 'success'|'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
      if (currentUser) {
        loadProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSettingsForm(settings);
    setCategories(settings.categories || []);
    setMaterials(settings.materials || []);
    setStyles(settings.styles || []);
  }, [settings]);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const fetched = await fetchProducts();
      setProducts(fetched);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      showNotification("Login failed.", "error");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProducts([]);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const finalSettings = {
        ...settingsForm,
        categories,
        materials,
        styles,
      };
      await updateSettings(finalSettings);
      await refreshSettings();
      showNotification("Settings saved successfully.", "success");
    } catch (err: any) {
      showNotification("Failed to save settings: " + err.message, "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const openForm = (product?: Product) => {
    if (product) {
      setFormData({
        ...product,
        images: product.images || []
      });
      setIsEditing(true);
    } else {
      setFormData({ id: '', name: '', price: 0, material: '', style: '', type: '', image: '', description: '', images: [] });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
       // Auto-generate a simple ID if none provided
       formData.id = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    }
    
    // Convert to number strictly
    const submitData = { ...formData, price: Number(formData.price) };
    const { id, ...dataWithoutId } = submitData;

    try {
      if (isEditing) {
        await updateProduct(id, dataWithoutId);
      } else {
        await createProduct(id, dataWithoutId);
      }
      setIsFormOpen(false);
      showNotification(`Product ${isEditing ? 'updated' : 'created'} successfully!`, "success");
      loadProducts();
    } catch (error: any) {
      showNotification("Failed to save product: " + error.message, "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id);
        showNotification("Product deleted.", "success");
        loadProducts();
      } catch (error: any) {
        showNotification("Failed to delete product: " + error.message, "error");
      }
    }
  };

  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><p>Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="bg-white p-12 border border-gray-100 shadow-sm text-center">
          <h1 className="text-2xl font-bold tracking-tighter text-black mb-6">Admin Sign In</h1>
          <p className="text-sm text-gray-500 mb-8 max-w-sm">Sign in with your admin Google account to manage the store's inventory.</p>
          <button 
            onClick={handleLogin}
            className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const availableTypes = Array.from(new Set([...products.map(p => p.type), ...(settings.categories || [])])).filter(Boolean);
  const availableMaterials = Array.from(new Set([...products.map(p => p.material), ...(settings.materials || [])])).filter(Boolean);
  const availableStyles = Array.from(new Set([...products.map(p => p.style), ...(settings.styles || [])])).filter(Boolean);

  const filteredProducts = products.filter(product => {
    if (filterType !== 'All' && product.type !== filterType) return false;
    if (filterMaterial !== 'All' && product.material !== filterMaterial) return false;
    if (filterStyle !== 'All' && product.style !== filterStyle) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 text-sm font-medium shadow-md ${notification.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-black text-white'}`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Logged in as {user.email}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 border border-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            <Package size={14} /> Inventory
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
          >
            <SettingsIcon size={14} /> Site Settings
          </button>
        </div>

        {activeTab === 'settings' ? (
          <div className="bg-white p-8 border border-gray-100 mb-12 shadow-sm rounded-sm max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Global Website Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Location/Address</label>
                <textarea 
                  required
                  rows={3}
                  value={settingsForm.location} 
                  onChange={(e) => setSettingsForm({...settingsForm, location: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm resize-y"
                  placeholder="842 Design Blvd, Suite 100&#10;San Francisco, CA 94103"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Contact Number</label>
                <input 
                  required
                  type="text" 
                  value={settingsForm.contactNumber} 
                  onChange={(e) => setSettingsForm({...settingsForm, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  placeholder="+1 (555) 012-3456"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Contact Email</label>
                <input 
                  required
                  type="email" 
                  value={settingsForm.contactEmail} 
                  onChange={(e) => setSettingsForm({...settingsForm, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  placeholder="hello@sb-enterprise.com"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Established Date (Year)</label>
                <input 
                  required
                  type="text" 
                  value={settingsForm.estDate} 
                  onChange={(e) => setSettingsForm({...settingsForm, estDate: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  placeholder="2026"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {categories.map((cat, idx) => (
                    editingCategory?.index === idx ? (
                      <div key={idx} className="flex items-center gap-1 bg-white border border-gray-300 px-1 py-0.5 rounded-sm">
                        <input 
                          value={editingCategory.value} 
                          onChange={e => setEditingCategory({index: idx, value: e.target.value})}
                          onKeyDown={e => {
                            if(e.key === 'Enter') {
                              e.preventDefault();
                              const newCats = [...categories];
                              newCats[idx] = editingCategory.value.trim();
                              setCategories(newCats);
                              setEditingCategory(null);
                            }
                          }}
                          className="px-1 py-0.5 text-xs outline-none w-24 bg-transparent"
                          autoFocus
                        />
                        <button type="button" onClick={() => {
                          const newCats = [...categories];
                          newCats[idx] = editingCategory.value.trim();
                          setCategories(newCats);
                          setEditingCategory(null);
                        }} className="text-gray-400 hover:text-black pr-1">Save</button>
                      </div>
                    ) : (
                      <span key={idx} className="bg-gray-100 text-black px-2 py-1 text-xs flex items-center gap-1 rounded-sm">
                        {cat}
                        <button type="button" onClick={() => setEditingCategory({index: idx, value: cat})} className="text-gray-400 hover:text-black ml-1">
                          <Edit2 size={12} />
                        </button>
                        <button type="button" onClick={() => setCategories(categories.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-black">
                          <X size={12} />
                        </button>
                      </span>
                    )
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                          setCategories([...categories, newCategory.trim()]);
                          setNewCategory('');
                        }
                      }
                    }}
                    placeholder="Add new category..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                          setCategories([...categories, newCategory.trim()]);
                          setNewCategory('');
                        }
                    }}
                    className="px-4 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 bg-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Materials</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {materials.map((mat, idx) => (
                    editingMaterial?.index === idx ? (
                      <div key={idx} className="flex items-center gap-1 bg-white border border-gray-300 px-1 py-0.5 rounded-sm">
                        <input 
                          value={editingMaterial.value} 
                          onChange={e => setEditingMaterial({index: idx, value: e.target.value})}
                          onKeyDown={e => {
                            if(e.key === 'Enter') {
                              e.preventDefault();
                              const newMats = [...materials];
                              newMats[idx] = editingMaterial.value.trim();
                              setMaterials(newMats);
                              setEditingMaterial(null);
                            }
                          }}
                          className="px-1 py-0.5 text-xs outline-none w-24 bg-transparent"
                          autoFocus
                        />
                        <button type="button" onClick={() => {
                          const newMats = [...materials];
                          newMats[idx] = editingMaterial.value.trim();
                          setMaterials(newMats);
                          setEditingMaterial(null);
                        }} className="text-gray-400 hover:text-black pr-1">Save</button>
                      </div>
                    ) : (
                      <span key={idx} className="bg-gray-100 text-black px-2 py-1 text-xs flex items-center gap-1 rounded-sm">
                        {mat}
                        <button type="button" onClick={() => setEditingMaterial({index: idx, value: mat})} className="text-gray-400 hover:text-black ml-1">
                          <Edit2 size={12} />
                        </button>
                        <button type="button" onClick={() => setMaterials(materials.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-black">
                          <X size={12} />
                        </button>
                      </span>
                    )
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newMaterial.trim() && !materials.includes(newMaterial.trim())) {
                          setMaterials([...materials, newMaterial.trim()]);
                          setNewMaterial('');
                        }
                      }
                    }}
                    placeholder="Add new material..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                        if (newMaterial.trim() && !materials.includes(newMaterial.trim())) {
                          setMaterials([...materials, newMaterial.trim()]);
                          setNewMaterial('');
                        }
                    }}
                    className="px-4 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 bg-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Styles</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {styles.map((sty, idx) => (
                    editingStyle?.index === idx ? (
                      <div key={idx} className="flex items-center gap-1 bg-white border border-gray-300 px-1 py-0.5 rounded-sm">
                        <input 
                          value={editingStyle.value} 
                          onChange={e => setEditingStyle({index: idx, value: e.target.value})}
                          onKeyDown={e => {
                            if(e.key === 'Enter') {
                              e.preventDefault();
                              const newSty = [...styles];
                              newSty[idx] = editingStyle.value.trim();
                              setStyles(newSty);
                              setEditingStyle(null);
                            }
                          }}
                          className="px-1 py-0.5 text-xs outline-none w-24 bg-transparent"
                          autoFocus
                        />
                        <button type="button" onClick={() => {
                          const newSty = [...styles];
                          newSty[idx] = editingStyle.value.trim();
                          setStyles(newSty);
                          setEditingStyle(null);
                        }} className="text-gray-400 hover:text-black pr-1">Save</button>
                      </div>
                    ) : (
                      <span key={idx} className="bg-gray-100 text-black px-2 py-1 text-xs flex items-center gap-1 rounded-sm">
                        {sty}
                        <button type="button" onClick={() => setEditingStyle({index: idx, value: sty})} className="text-gray-400 hover:text-black ml-1">
                          <Edit2 size={12} />
                        </button>
                        <button type="button" onClick={() => setStyles(styles.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-black">
                          <X size={12} />
                        </button>
                      </span>
                    )
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newStyle.trim() && !styles.includes(newStyle.trim())) {
                          setStyles([...styles, newStyle.trim()]);
                          setNewStyle('');
                        }
                      }
                    }}
                    placeholder="Add new style..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                        if (newStyle.trim() && !styles.includes(newStyle.trim())) {
                          setStyles([...styles, newStyle.trim()]);
                          setNewStyle('');
                        }
                    }}
                    className="px-4 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 bg-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => openForm()}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

        {isFormOpen && (
          <div className="bg-white p-8 border border-gray-100 mb-12 shadow-sm rounded-sm">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">ID (Optional on create)</label>
                <input 
                  type="text" 
                  value={formData.id} 
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  disabled={isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Price (₹)</label>
                <input 
                  required
                  type="number" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Type / Category</label>
                <input 
                  required
                  list="categories-list"
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  placeholder="Select or type..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm text-black"
                />
                <datalist id="categories-list">
                  {availableTypes.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Material</label>
                <input 
                  required
                  list="materials-list"
                  value={formData.material} 
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  placeholder="Select or type..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm text-black"
                />
                <datalist id="materials-list">
                  {availableMaterials.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Style</label>
                <input 
                  required
                  list="styles-list"
                  value={formData.style} 
                  onChange={(e) => setFormData({...formData, style: e.target.value})}
                  placeholder="Select or type..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm text-black"
                />
                <datalist id="styles-list">
                  {availableStyles.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Main Image URL</label>
                <input 
                  required
                  type="url" 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Additional Images (Optional)</label>
                <div className="flex flex-col gap-2">
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="url" 
                        value={img}
                        onChange={(e) => {
                          const newImages = [...(formData.images || [])];
                          newImages[idx] = e.target.value;
                          setFormData({...formData, images: newImages});
                        }}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newImages = (formData.images || []).filter((_, i) => i !== idx);
                          setFormData({...formData, images: newImages});
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      setFormData({...formData, images: [...(formData.images || []), '']});
                    }}
                    className="self-start text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-2 hover:bg-gray-200 transition-colors mt-1"
                  >
                    + Add Image URL
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-black focus:outline-none text-sm resize-y"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 border border-gray-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800"
                >
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-sm">
          {isLoadingProducts ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-500 mb-4">No products found in the database.</p>
              <button 
                onClick={async () => {
                   try {
                     const { products: defaultProducts } = await import('../data/products');
                     for (const p of defaultProducts) {
                       const { id, ...data } = p;
                       await createProduct(id, data);
                     }
                     showNotification("Dummy data seeded.", "success");
                     loadProducts();
                   } catch (e: any) {
                     showNotification("Failed to seed: " + e.message, "error");
                   }
                }}
                className="text-[10px] uppercase font-bold tracking-widest border border-black px-4 py-2 hover:bg-gray-50"
              >
                 Seed Dummy Data
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-4 p-4 border-b border-gray-100 bg-gray-50 items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Filter By:</span>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-200 focus:border-black focus:outline-none text-xs"
                >
                  <option value="All">All Categories</option>
                  {availableTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  value={filterMaterial} 
                  onChange={(e) => setFilterMaterial(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-200 focus:border-black focus:outline-none text-xs"
                >
                  <option value="All">All Materials</option>
                  {availableMaterials.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={filterStyle} 
                  onChange={(e) => setFilterStyle(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-200 focus:border-black focus:outline-none text-xs"
                >
                  <option value="All">All Styles</option>
                  {availableStyles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {(filterType !== 'All' || filterMaterial !== 'All' || filterStyle !== 'All') && (
                  <button 
                    onClick={() => { setFilterType('All'); setFilterMaterial('All'); setFilterStyle('All'); }}
                    className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-black ml-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Image</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Name</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Type</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Price</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <img referrerPolicy="no-referrer" src={product.image} alt={product.name} className="w-12 h-12 object-cover object-center rounded-sm bg-gray-200" />
                      </td>
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-gray-500">{product.type} / {product.material}</td>
                      <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openForm(product)} className="p-2 flex items-center gap-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded text-[10px] font-bold uppercase tracking-widest">
                            <Edit2 size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(product.id, product.name)} className="p-2 flex items-center gap-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-[10px] font-bold uppercase tracking-widest">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-sm text-gray-400">
                  No products match the selected filters.
                </div>
              )}
            </div>
            </div>
          )}
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
