import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';

function getStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function getStartOfWeek() {
  const d = new Date();
  const day = d.getDay();
  // Set to Monday if week begins on Monday, let's just go day - day of week (Sunday is 0)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function MyVisits() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const data = await api.getVisits();
      setVisits(data);
    } catch (err) {
      alert("Error fetching visits: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const todayStart = getStartOfToday();
  const weekStart = getStartOfWeek();

  const todayCount = visits.filter(v => new Date(v.createdAt) >= todayStart).length;
  const thisWeekCount = visits.filter(v => new Date(v.createdAt) >= weekStart).length;

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-4 max-w-lg mx-auto pb-32">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex flex-col items-center justify-center text-outline bg-white border border-[#E9ECEF] rounded-lg active:scale-95 transition-transform">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <h1 className="font-h1 text-2xl text-on-background">My Visits</h1>
        </div>

        {/* Metric Summary */}
        <div className="flex gap-4 mb-6">
           <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 shadow-sm">
              <p className="font-label-caps text-xs text-primary uppercase mb-1 font-bold tracking-wider">Calls Today</p>
              <p className="font-h2 text-3xl text-primary">{todayCount}</p>
           </div>
           <div className="flex-1 bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-sm">
              <p className="font-label-caps text-xs text-outline uppercase mb-1 font-bold tracking-wider">Calls This Week</p>
              <p className="font-h2 text-3xl text-on-surface">{thisWeekCount}</p>
           </div>
        </div>

        {/* Visits Listing */}
        <div className="space-y-4">
           {visits.length === 0 && !loading && (
             <div className="text-center py-10 opacity-60">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">inbox</span>
                <p className="font-body-md text-outline">No visits found.</p>
             </div>
           )}

           {visits.map((v) => {
             // Handle array of products or fallback singular
             const productsList = v.products && v.products.length > 0 
                ? v.products.map(p => p.product).join(', ')
                : (v.product || 'N/A');

             const doctorName = v.doctorId ? v.doctorId.name : 'Unknown Doctor';
             const isSample = v.sampleGiven;
             const followUp = v.nextFollowUp ? new Date(v.nextFollowUp).toLocaleDateString() : 'None';

             return (
               <div key={v._id} className="bg-white border border-[#E9ECEF] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-[#F8F9FA] px-4 py-3 border-b border-[#E9ECEF] flex justify-between items-center">
                     <div>
                       <p className="font-label-caps text-[10px] text-outline uppercase tracking-wider mb-0.5">Doctor</p>
                       <p className="font-body-md font-bold text-on-surface leading-tight text-lg">{doctorName}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-label-caps text-[10px] text-outline uppercase tracking-wider mb-0.5">Date</p>
                       <p className="font-button text-on-surface">{new Date(v.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>

                  <div className="p-4 space-y-3">
                     <div className="flex items-start justify-between gap-2">
                       <div className="flex-1">
                         <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block mb-0.5">Discussed</span>
                         <p className="font-body-md text-sm font-medium leading-snug break-words">{productsList}</p>
                       </div>
                       <div className="shrink-0 text-right">
                         <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block mb-0.5">Sample</span>
                         <span className={`text-xs px-2 py-0.5 rounded font-bold ${isSample ? 'bg-[#25D366]/10 text-[#1DA851]' : 'bg-[#E9ECEF] text-outline'}`}>
                            {isSample ? 'Given' : 'No'}
                         </span>
                       </div>
                     </div>

                     <div className="border-t border-[#E9ECEF] pt-2 flex items-center justify-between">
                       <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">Next Follow-up</span>
                       <span className="text-sm font-bold text-primary">{followUp}</span>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      </main>
    </>
  );
}
