import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function MyOrders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('today'); // 'all', 'today', '7days'

  useEffect(() => {
    fetchOrders(filter);
  }, [filter]);

  const fetchOrders = async (period) => {
    setLoading(true);
    try {
      const data = await api.getOrders(period === 'all' ? '' : period);
      setOrders(data);
    } catch (err) {
      alert("Error fetching orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = orders.reduce((sum, o) => sum + (o.totalOrderValue || o.totalValue || 0), 0);

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-4 max-w-lg mx-auto pb-32">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex flex-col items-center justify-center text-outline bg-white border border-[#E9ECEF] rounded-lg active:scale-95 transition-transform">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-h1 text-2xl text-on-background">History</h1>
        </div>

        {/* Metric Summary */}
        <div className="flex gap-4 mb-6">
           <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm">
              <p className="font-label-caps text-xs text-primary uppercase mb-1 font-bold tracking-wider">Total Orders</p>
              <p className="font-h2 text-3xl text-primary">{orders.length}</p>
           </div>
           <div className="flex-1 bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-sm">
              <p className="font-label-caps text-xs text-outline uppercase mb-1 font-bold tracking-wider">Total Bus. Value</p>
              <p className="font-h2 text-2xl text-on-surface truncate">₹{totalValue}</p>
           </div>
        </div>

        {/* Filter Segment Control */}
        <div className="flex bg-[#F8F9FA] rounded-xl p-1 mb-6 border border-[#E9ECEF] shadow-inner">
           {['today', '7days', 'all'].map(f => (
             <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 font-button text-sm rounded-lg capitalize transition-all ${filter === f ? 'bg-white shadow-sm text-primary font-bold' : 'text-outline hover:text-on-surface-variant'}`}
             >
                {f === '7days' ? 'Last 7 Days' : f}
             </button>
           ))}
        </div>

        {/* Orders Listing */}
        <div className="space-y-4">
           {orders.length === 0 && !loading && (
             <div className="text-center py-10 opacity-60">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">inbox</span>
                <p className="font-body-md text-outline">No orders found.</p>
             </div>
           )}

           {orders.map((o) => (
             <div key={o._id} className="bg-white border border-[#E9ECEF] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#F8F9FA] px-4 py-3 border-b border-[#E9ECEF] flex justify-between items-center">
                   <div>
                     <p className="font-label-caps text-[10px] text-outline uppercase tracking-wider mb-0.5">Stockist</p>
                     <p className="font-body-md font-bold text-on-surface leading-tight">{o.stockistName}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-label-caps text-[10px] text-outline uppercase tracking-wider mb-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                     <p className="font-button text-primary">₹{o.totalOrderValue || o.totalValue || 0}</p>
                   </div>
                </div>

                <div className="p-4 space-y-3">
                   {o.products && o.products.length > 0 ? (
                      o.products.map((p, idx) => (
                         <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                               <p className="font-body-md text-sm font-medium mr-2 leading-snug break-words">{p.product}</p>
                               <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium shrink-0">₹{p.totalValue}</span>
                            </div>
                            <p className="text-xs text-outline font-medium">Qty: {p.paidQty}P + {p.freeQty}F = {p.totalQty}</p>
                            {idx < o.products.length - 1 && <div className="border-b border-[#E9ECEF] mt-3 border-dashed"></div>}
                         </div>
                      ))
                   ) : (
                      <div className="flex flex-col gap-1">
                         <div className="flex justify-between items-start">
                            <p className="font-body-md text-sm font-medium mr-2 leading-snug break-words">{o.product}</p>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium shrink-0">₹{o.totalValue}</span>
                         </div>
                         <p className="text-xs text-outline font-medium">Qty: {o.paidQty}P + {o.freeQty}F = {o.totalQty}</p>
                      </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      </main>
    </>
  );
}
