import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function SearchableProductSelect({ value, onChange }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newProdData, setNewProdData] = useState({ name: '', rate: '' });
  const containerRef = useRef(null);

  // Fetch products
  const fetchProducts = () => {
    api.getProducts().then(data => setProducts(data)).catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdown when typing outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProduct = products.find(p => p.name === value);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (prodName, prodRate) => {
    onChange(prodName, prodRate);
    setIsOpen(false);
    setSearch('');
  };

  const handleAddNewSubmit = async (e) => {
    e.preventDefault();
    if (!newProdData.name || newProdData.rate === '') return;
    setLoading(true);
    try {
      const payload = { name: newProdData.name, rate: Number(newProdData.rate) };
      const inserted = await api.createProduct(payload);
      
      // update products list
      setProducts(prev => {
        let updated = [...prev];
        if (inserted.__offlineSaved) {
            updated.push({ _id: 'temp_' + Date.now(), ...payload });
        } else {
            updated.push(inserted);
        }
        return updated.sort((a,b) => a.name.localeCompare(b.name));
      });
      
      // auto select
      handleSelect(payload.name, payload.rate);
      
      setShowAddModal(false);
      setNewProdData({ name: '', rate: '' });
      alert("Product added successfully");
    } catch(err) {
      alert("Error adding product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="w-full h-[48px] px-md bg-white border border-[#E9ECEF] rounded-lg flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedProduct ? 'text-on-background' : 'text-outline italic'}>
          {selectedProduct ? `${selectedProduct.name}` : 'Pick a product'}
        </span>
        <span className="material-symbols-outlined text-outline pointer-events-none">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[52px] left-0 w-full bg-white border border-[#E9ECEF] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col max-h-[300px]">
          <div className="p-sm border-b border-[#E9ECEF] flex gap-2 items-center">
            <span className="material-symbols-outlined text-outline">search</span>
            <input 
              type="text" 
              className="w-full outline-none text-body-md" 
              placeholder="Search products..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredProducts.map(prod => (
              <div 
                key={prod._id} 
                onClick={() => handleSelect(prod.name, prod.rate)}
                className="px-md py-sm hover:bg-surface-container-highest cursor-pointer border-b border-[#E9ECEF]/50 last:border-0"
              >
                <div className="flex justify-between items-center w-full">
                   <p className="font-body-md whitespace-nowrap overflow-hidden text-ellipsis flex-1">{prod.name}</p>
                   <span className="text-xs text-outline font-medium bg-[#F8F9FA] px-2 py-0.5 rounded ml-2 whitespace-nowrap">₹{prod.rate}</span>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && search && (
              <div className="p-md text-center text-outline text-sm">No products found matching "{search}"</div>
            )}
          </div>
          
          <div 
             className="p-sm bg-primary/5 text-primary border-t border-primary/20 font-button text-center cursor-pointer hover:bg-primary/10 transition-colors"
             onClick={() => {
                setIsOpen(false);
                setNewProdData(prev => ({ ...prev, name: search }));
                setShowAddModal(true);
             }}
          >
             + Add New Product
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-lg shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-h2 text-h2">Add New Product</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-background">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddNewSubmit} className="space-y-sm">
              <div>
                <label className="font-label-caps block mb-1">Product Name *</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newProdData.name} 
                  onChange={e => setNewProdData({...newProdData, name: e.target.value})} 
                  className="w-full h-12 px-3 border border-[#E9ECEF] rounded-lg outline-primary"
                  placeholder="e.g. CardioShield"
                />
              </div>
              <div>
                <label className="font-label-caps block mb-1">Rate (₹) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={newProdData.rate} 
                  onChange={e => setNewProdData({...newProdData, rate: e.target.value})} 
                  className="w-full h-12 px-3 border border-[#E9ECEF] rounded-lg outline-primary"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-primary text-white rounded-xl shadow active:scale-95 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
