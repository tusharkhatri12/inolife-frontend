import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function FollowUps() {
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState([]);

  const fetchData = () => {
    setLoading(true);
    api.getFollowUps()
      .then(data => setFollowups(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkDone = async (id) => {
    setLoading(true);
    try {
      await api.completeFollowUp(id);
      fetchData(); // Refresh list
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  };

  const getStatus = (f) => {
    const d = new Date(f.nextFollowUp);
    d.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return d < today ? 'OVERDUE' : 'TODAY';
  };

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-4 max-w-2xl mx-auto pb-20">
        <div className="mb-6">
          <h1 className="font-h1 text-h1 text-on-background">Follow-ups</h1>
          <p className="font-body-md text-on-surface-variant">Review your pending provider interactions.</p>
        </div>

        <div className="space-y-4">
          {followups.map(f => {
            const status = getStatus(f);
            return (
              <div key={f._id} className={`bg-white border border-[#E9ECEF] rounded-lg p-md flex flex-col gap-4 ${status === 'COMPLETED' ? 'opacity-75 bg-surface-container-low' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${status==='OVERDUE' ? 'bg-error' : 'bg-[#FFC107]'}`}></span>
                       <span className={`px-2 py-0.5 rounded-sm font-label-caps font-bold tracking-widest text-[10px] ${status==='OVERDUE' ? 'bg-error/10 text-error' : 'bg-[#FFF9E6] text-[#D4A000]'}`}>{status}</span>
                    </div>
                    <h2 className="font-h2 text-h2 text-on-surface">
                      {f.doctorId?.name || 'Unknown Doctor'}
                    </h2>
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-md">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span>{f.doctorId?.area}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-label-caps text-label-caps ${status === 'OVERDUE' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {new Date(f.nextFollowUp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button onClick={() => handleMarkDone(f._id)} className="w-full bg-[#1DA851] text-white hover:brightness-105 transition-all shadow-sm h-[48px] font-button rounded-xl active:scale-[0.98] flex items-center justify-center gap-2">
                   <span className="material-symbols-outlined text-[20px]">check_circle</span> Mark Done
                </button>
              </div>
            );
          })}
          
          {followups.length === 0 && !loading && (
             <p className="text-center mt-10 text-outline">No follow-ups found.</p>
          )}
        </div>
      </main>
    </>
  );
}
