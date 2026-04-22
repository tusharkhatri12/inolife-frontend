import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);

  useEffect(() => {
    api.getFollowUps().then(data => {
      setFollowUpCount(data.length);
      if (data.length > 0 && !sessionStorage.getItem('followUpsOpened')) {
        sessionStorage.setItem('followUpsOpened', 'true');
        navigate('/follow-ups');
      }
    }).catch(console.error);
  }, [navigate]);

  const handleDailyReport = async () => {
    setLoading(true);
    try {
      const { visits, orders } = await api.getDailyReport();
      
      const totalOrderValue = orders.reduce((sum, o) => sum + (o.totalValue || 0), 0);
      const mrName = 'Representative';
      const date = new Date().toLocaleDateString();

      let msg = `Daily Report – ${date}\n\n`;
      msg += `Total Doctor Visits: ${visits.length}\n\n`;
      msg += `Orders:\n`;

      if (orders.length === 0) {
        msg += `No orders today.\n`;
      } else {
        orders.forEach(o => {
          msg += `\nStockist: ${o.stockistName}\n`;
          if (o.products && o.products.length > 0) {
             o.products.forEach((p, i) => {
               msg += `  ${i+1}. ${p.product} (Paid: ${p.paidQty}, Free: ${p.freeQty}) = ₹${p.totalValue}\n`;
             });
          } else if (o.product) {
             msg += `  1. ${o.product} (Paid: ${o.paidQty}, Free: ${o.freeQty}) = ₹${o.totalValue}\n`;
          }
          const orderVal = o.totalOrderValue || o.totalValue || 0;
          msg += `Order Total: ₹${orderVal}\n`;
        });
      }

      const overallTotal = orders.reduce((sum, o) => sum + (o.totalOrderValue || o.totalValue || 0), 0);
      msg += `\nTotal Day Order Value: ₹${overallTotal}\n\n`;
      msg += `MR: ${mrName}`;

      const waLink = `https://wa.me/919871800833?text=${encodeURIComponent(msg)}`;
      window.open(waLink, '_blank');
      
    } catch (err) {
      alert("Error generating report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 pb-20 px-container-margin max-w-lg mx-auto w-full flex flex-col items-center">
        <div className="w-full mb-xl text-center">
          <p className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-base">Today</p>
          <h1 className="font-h1 text-h1 text-on-background line-clamp-1 mx-2">Welcome, {localStorage.getItem('mrName') || 'Representative'}</h1>
          
          {followUpCount > 0 && (
             <div onClick={() => navigate('/follow-ups')} className="mt-4 mx-auto w-fit bg-[#FFF9E6] border border-[#FFC107]/50 text-[#D4A000] px-4 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                <span className="font-bold text-sm tracking-wide">Today's Follow-ups: <span className="text-lg ml-1">{followUpCount}</span></span>
             </div>
          )}
        </div>

        <div className="w-full space-y-md">
          <button 
            onClick={() => navigate('/add-visit')}
            className="w-full bg-primary text-on-primary h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-primary-container"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">medical_services</span>
              </div>
              <span className="font-button text-button">Add Visit</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/add-order')}
            className="w-full bg-primary text-on-primary h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-primary-container"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">package_2</span>
              </div>
              <span className="font-button text-button">Add Order</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/my-orders')}
            className="w-full bg-primary text-on-primary h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-primary-container"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">receipt_long</span>
              </div>
              <span className="font-button text-button">My Orders</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/follow-ups')}
            className="w-full bg-primary text-on-primary h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-primary-container"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">calendar_month</span>
              </div>
              <span className="font-button text-button">Follow-ups</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>

          <button 
            onClick={() => navigate('/my-visits')}
            className="w-full bg-primary text-on-primary h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-primary-container"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">medical_information</span>
              </div>
              <span className="font-button text-button">My Visits</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>

          <button 
            onClick={handleDailyReport}
            className="w-full bg-[#25D366] text-white h-[84px] rounded-xl px-lg flex items-center justify-between active:scale-[0.98] transition-transform duration-150 shadow-sm border border-[#1DA851]"
          >
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">assessment</span>
              </div>
              <span className="font-button text-button">Send Daily Report</span>
            </div>
            <span className="material-symbols-outlined opacity-50">chevron_right</span>
          </button>
        </div>
      </main>
    </>
  );
}
