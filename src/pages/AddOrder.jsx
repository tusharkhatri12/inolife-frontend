import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';
import SearchableDoctorSelect from '../components/SearchableDoctorSelect';
import SearchableProductSelect from '../components/SearchableProductSelect';

export default function AddOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const [formData, setFormData] = useState({
    stockistName: '',
    doctorId: '',
    products: [
      { product: '', paidQty: 1, freeQty: 0, rate: 0, totalQty: 1, totalValue: 0 }
    ]
  });

  const handleBaseChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (idx, prodName, newRate) => {
    setFormData(prev => {
      const newProds = [...prev.products];
      const p = { ...newProds[idx] };
      p.product = prodName;
      if (newRate !== undefined) p.rate = Number(newRate) || 0;
      p.totalValue = parseFloat((p.paidQty * p.rate).toFixed(2));
      newProds[idx] = p;
      return { ...prev, products: newProds };
    });
  };

  const handleQtyChange = (idx, field, delta) => {
    setFormData(prev => {
      const newProds = [...prev.products];
      const p = { ...newProds[idx] };
      const current = p[field];
      const min = field === 'paidQty' ? 1 : 0;
      p[field] = Math.max(min, current + delta);
      p.totalQty = p.paidQty + p.freeQty;
      p.totalValue = parseFloat((p.paidQty * p.rate).toFixed(2));
      newProds[idx] = p;
      return { ...prev, products: newProds };
    });
  };

  const addProductLine = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { product: '', paidQty: 1, freeQty: 0, rate: 0, totalQty: 1, totalValue: 0 }]
    }));
  };

  const removeProductLine = (idx) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== idx)
    }));
  };

  const totalOrderValue = parseFloat(formData.products.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validProds = formData.products.filter(p => p.product !== '');
    if (!formData.stockistName || validProds.length === 0) {
      alert("Stockist and at least one Product are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
          ...formData,
          products: validProds,
          totalOrderValue
      };
      if (!payload.doctorId) delete payload.doctorId;
      
      const res = await api.createOrder(payload);
      if (res.__offlineSaved) {
        alert(res.message);
        setSubmittedOrder(payload);
      } else {
        setSubmittedOrder(res);
      }
    } catch (err) {
      alert("Error saving order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString();
  };

  const handleSendWhatsApp = () => {
    let msg = `New Order Received\n\n`;
    msg += `Stockist: ${submittedOrder.stockistName}\n\n`;
    
    const prods = submittedOrder.products || [];
    prods.forEach((p, i) => {
       msg += `Product ${i+1}: ${p.product}\n`;
       msg += `Paid Qty: ${p.paidQty}\n`;
       msg += `Free Qty: ${p.freeQty}\n`;
       msg += `Total Qty: ${p.totalQty}\n`;
       msg += `Value: ₹${p.totalValue}\n\n`;
    });
    
    msg += `Total Order Value: ₹${submittedOrder.totalOrderValue}\n`;
    msg += `MR: ${submittedOrder.mrName || 'Representative'}\n`;
    msg += `Date: ${formatDate()}`;

    const waLink = `https://wa.me/919871800833?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
    navigate('/');
  };

  if (submittedOrder) {
    return (
      <main className="pt-20 px-container-margin max-w-md mx-auto pb-40 text-center">
        <div className="mb-lg mt-10">
          <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">check</span>
          </div>
          <h1 className="font-h1 text-h1 mb-xs text-on-background">Order Submitted</h1>
          <p className="font-body-md text-on-surface-variant">Your order has been successfully recorded.</p>
        </div>

        <div className="bg-surface-container-low p-md rounded-xl border border-[#E9ECEF] mb-lg text-left shadow-sm">
           <p className="font-body-md mb-2"><strong>Stockist:</strong> {submittedOrder.stockistName}</p>
           <div className="border-t border-[#E9ECEF] pt-2 mt-2">
             <p className="font-label-caps text-outline mb-1 text-xs uppercase">Products Summary</p>
             {(submittedOrder.products || []).map((p, i) => (
                <div key={i} className="flex justify-between items-center mb-1">
                   <p className="font-body-sm text-sm truncate flex-1 pr-2">{p.paidQty}x {p.product}</p>
                   <p className="font-body-sm text-sm">₹{p.totalValue}</p>
                </div>
             ))}
           </div>
           <div className="border-t border-[#E9ECEF] pt-3 mt-3 flex justify-between items-end">
              <p className="font-body-md font-bold mb-1">Total Value:</p>
              <p className="font-h2 text-primary">₹{submittedOrder.totalOrderValue}</p>
           </div>
        </div>

        <button 
          onClick={handleSendWhatsApp}
          className="w-full h-[56px] bg-[#25D366] text-white font-button rounded-xl shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mb-4 hover:brightness-105 transition-all">
          <span className="material-symbols-outlined">send</span>
          Send to Sir on WhatsApp
        </button>

        <button 
          onClick={() => navigate('/')}
          className="w-full h-[56px] bg-transparent text-primary border border-primary font-button rounded-xl shadow-sm active:scale-[0.98] flex items-center justify-center hover:bg-primary/5 transition-all">
          Back to Home
        </button>
      </main>
    )
  }

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-container-margin max-w-md mx-auto pb-40">
        <div className="mb-lg">
          <h1 className="font-h1 text-h1 mb-xs">New Order</h1>
          <p className="font-body-md text-on-surface-variant">Complete order details for stock replenishment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="space-y-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Select Stockist</label>
            <div className="relative">
              <select name="stockistName" value={formData.stockistName} onChange={handleBaseChange} className="w-full h-[48px] px-md bg-white border border-[#E9ECEF] rounded-lg appearance-none outline-primary/50 cursor-pointer">
                <option value="" disabled>Choose a distributor</option>
                <option value="TONDON">TONDON</option>
                <option value="NEELKANTH NOIDA">NEELKANTH NOIDA</option>
                <option value="NEELKANTH PARTPARGANJ">NEELKANTH PARTPARGANJ</option>
                <option value="VABROS">VABROS</option>
                <option value="SHASHI MEDICAL HALL">SHASHI MEDICAL HALL</option>
                <option value="LIFE LINE">LIFE LINE</option>
                <option value="SHRI BALAJI">SHRI BALAJI</option>
                <option value="REEM DISTRIBUTOR">REEM DISTRIBUTOR</option>
                <option value="DISHMIK">DISHMIK</option>
                <option value="AARK PHARMA">AARK PHARMA</option>
                <option value="GENESIS">GENESIS</option>
                <option value="AMARJEET">AMARJEET</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="space-y-md py-2">
            <div className="flex justify-between items-center px-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase flex gap-1 items-center">
                 <span className="material-symbols-outlined text-[16px]">list_alt</span> Products Listed
              </label>
            </div>
            
            {formData.products.map((p, idx) => (
              <div key={idx} className="bg-white border border-[#E9ECEF] p-sm rounded-xl space-y-sm relative pb-4 shadow-sm hover:shadow-md transition-shadow">
                
                {formData.products.length > 1 && (
                  <button type="button" onClick={() => removeProductLine(idx)} className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-[#E9ECEF] rounded-full text-error flex justify-center items-center shadow-sm z-10 hover:bg-error/10 hover:border-error/40 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}

                <div className="space-y-xs relative z-0">
                  <SearchableProductSelect 
                      value={p.product} 
                      onChange={(prodName, newRate) => handleProductChange(idx, prodName, newRate)} 
                  />
                  {p.rate > 0 && <p className="text-secondary text-sm ml-2 font-medium">Rate: ₹{p.rate}</p>}
                </div>

                <div className="flex gap-sm pt-2">
                  <div className="bg-surface-container-low p-2 rounded-lg border border-[#E9ECEF] space-y-1 flex-1">
                    <label className="font-label-caps text-[10px] text-on-surface-variant block text-center uppercase">Paid Qty</label>
                    <div className="flex items-center justify-between gap-1">
                      <button type="button" onClick={() => handleQtyChange(idx, 'paidQty', -1)} className="w-[32px] h-[32px] bg-white border rounded flex items-center justify-center text-primary active:scale-95 shadow-sm hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <div className="flex-1 text-center font-bold text-lg text-on-background">{p.paidQty}</div>
                      <button type="button" onClick={() => handleQtyChange(idx, 'paidQty', 1)} className="w-[32px] h-[32px] bg-white border rounded flex items-center justify-center text-primary active:scale-95 shadow-sm hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-2 rounded-lg border border-[#E9ECEF] space-y-1 flex-1">
                    <label className="font-label-caps text-[10px] text-on-surface-variant block text-center uppercase">Free Qty</label>
                    <div className="flex items-center justify-between gap-1">
                      <button type="button" onClick={() => handleQtyChange(idx, 'freeQty', -1)} className="w-[32px] h-[32px] bg-white border rounded flex items-center justify-center text-primary active:scale-95 shadow-sm hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <div className="flex-1 text-center font-bold text-lg text-on-background">{p.freeQty}</div>
                      <button type="button" onClick={() => handleQtyChange(idx, 'freeQty', 1)} className="w-[32px] h-[32px] bg-white border rounded flex items-center justify-center text-primary active:scale-95 shadow-sm hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1 pt-2 border-t border-[#E9ECEF] mt-3">
                   <p className="text-sm text-outline">Total Qty: <strong className="text-on-background">{p.totalQty}</strong></p>
                   <p className="text-sm text-outline">Value: <strong className="text-primary text-base">₹{p.totalValue}</strong></p>
                </div>
              </div>
            ))}

            <button type="button" onClick={addProductLine} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E9ECEF] bg-white text-outline hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all rounded-xl h-14 font-button active:scale-[0.98]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span> Add Another Product
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 flex justify-between items-center shadow-inner">
            <div>
               <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Total Order Value</p>
               <p className="font-h1 text-[28px] text-primary">₹{totalOrderValue}</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary/50">
               <span className="material-symbols-outlined">payments</span>
            </div>
          </div>

          <div className="space-y-xs pt-4">
            <div className="flex justify-between items-center">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Select Doctor</label>
              <span className="font-caption text-caption text-outline italic">Optional</span>
            </div>
            <SearchableDoctorSelect name="doctorId" value={formData.doctorId} onChange={handleBaseChange} />
          </div>

          <div className="fixed bottom-[64px] left-0 w-full bg-white dark:bg-slate-900 border-t border-[#E9ECEF] p-container-margin z-50">
            <button type="submit" className="w-full h-[56px] bg-secondary text-on-secondary font-button rounded-xl shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 hover:brightness-105 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Submit Order
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
