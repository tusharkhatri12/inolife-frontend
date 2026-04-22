import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';
import SearchableDoctorSelect from '../components/SearchableDoctorSelect';
import SearchableProductSelect from '../components/SearchableProductSelect';

export default function AddVisit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorId: '',
    products: [''],
    sampleGiven: false,
    nextFollowUp: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductChange = (idx, val) => {
    const newProds = [...formData.products];
    newProds[idx] = val;
    setFormData(prev => ({ ...prev, products: newProds }));
  };

  const addProduct = () => {
    setFormData(prev => ({ ...prev, products: [...prev.products, ''] }));
  };

  const removeProduct = (idx) => {
    setFormData(prev => ({ ...prev, products: prev.products.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validProducts = formData.products.filter(p => p !== '');
    if (!formData.doctorId || validProducts.length === 0) {
      alert("Please select doctor and at least one product.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = { ...formData, products: validProducts };
      const res = await api.createVisit(payload);
      if (res.__offlineSaved) {
        alert(res.message);
      }
      navigate('/');
    } catch (err) {
      alert("Error saving visit: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-container-margin max-w-lg mx-auto pb-32">
        <div className="mb-8">
          <h1 className="font-h1 text-h1 text-on-surface mb-2">Record Interaction</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="space-y-base">
            <div className="flex justify-between items-end mb-1">
              <label className="font-label-caps text-label-caps text-outline block uppercase">Select Doctor</label>
              {formData.doctorId && (
                 <button type="button" onClick={() => navigate('/doctor-history', { state: { doctorId: formData.doctorId } })} className="text-primary font-label-caps text-[10px] uppercase tracking-wider font-bold hover:opacity-80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                   <span className="material-symbols-outlined text-[14px]">history</span> View History
                 </button>
              )}
            </div>
            <SearchableDoctorSelect name="doctorId" value={formData.doctorId} onChange={handleChange} />
          </div>

          <div className="space-y-base">
            <label className="font-label-caps text-label-caps text-outline block uppercase">Select Products</label>
            <div className="space-y-3">
              {formData.products.map((prod, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <SearchableProductSelect 
                        value={prod} 
                        onChange={(prodName) => handleProductChange(idx, prodName)} 
                    />
                  </div>
                  {idx > 0 && (
                    <button type="button" onClick={() => removeProduct(idx)} className="w-[48px] h-[48px] flex items-center justify-center text-error border border-error/50 rounded-lg shrink-0 active:scale-95 transition-transform bg-error/5 hover:bg-error/10">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addProduct} className="text-secondary font-button flex items-center gap-1 mt-2 active:scale-95 px-2 py-1 -ml-2 rounded hover:bg-secondary/10">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Add Another Product
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg border border-[#E9ECEF]">
            <div>
              <span className="font-button text-on-surface block">Sample Given</span>
              <span className="font-caption text-on-surface-variant">Pharmaceutical samples distributed</span>
            </div>
            <input type="checkbox" name="sampleGiven" checked={formData.sampleGiven} onChange={handleChange} className="w-6 h-6 rounded border-[#E9ECEF] accent-primary" />
          </div>

          <div className="space-y-base">
            <label className="font-label-caps text-label-caps text-outline block uppercase">Next Follow-up Date</label>
            <div className="relative">
              <input type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange} className="w-full h-[48px] bg-white border border-[#E9ECEF] px-4 rounded-lg" />
            </div>
          </div>

          <div className="space-y-base">
            <label className="font-label-caps text-label-caps text-outline block uppercase">Interaction Notes (Optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-4 bg-white border border-[#E9ECEF] rounded-lg resize-none" rows="3" placeholder="Key takeaways..."></textarea>
          </div>

          <div className="fixed bottom-16 left-0 w-full p-container-margin bg-white/80 backdrop-blur-md border-t border-[#E9ECEF] z-40">
            <button type="submit" className="w-full h-[48px] bg-primary text-on-primary font-button rounded-xl active:scale-[0.98] transition-transform shadow hover:shadow-md">
              Submit Visit Report
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
