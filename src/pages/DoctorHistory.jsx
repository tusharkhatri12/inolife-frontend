import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function DoctorHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [doctorName, setDoctorName] = useState('Doctor History');

  useEffect(() => {
    if (!doctorId) {
      navigate('/add-visit');
      return;
    }
    fetchHistory();
  }, [doctorId]);

  const fetchHistory = async () => {
    try {
      const data = await api.getDoctorVisits(doctorId);
      setVisits(data);
      if (data.length > 0 && data[0].doctorId) {
         setDoctorName(data[0].doctorId.name);
      }
    } catch (err) {
      alert("Error fetching history: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader show={loading} />
      <main className="pt-20 px-4 max-w-lg mx-auto pb-32">
        <div className="flex items-center gap-3 mb-6 bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex flex-col items-center justify-center text-primary bg-white border border-primary/20 rounded-xl active:scale-95 transition-transform shadow-sm">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
             <p className="font-label-caps text-[10px] text-primary uppercase tracking-widest font-bold">Historical Records</p>
             <h1 className="font-h1 text-xl text-on-background leading-tight truncate">{doctorName}</h1>
          </div>
        </div>

        <div className="space-y-4">
           {visits.length === 0 && !loading && (
             <div className="text-center py-10 opacity-60">
                <span className="material-symbols-outlined text-[48px] text-outline mb-2">history_toggle_off</span>
                <p className="font-body-md text-outline">No previous visits found.</p>
             </div>
           )}

           {visits.map((v) => {
             const productsList = v.products && v.products.length > 0 
                ? v.products.map(p => p.product).join(', ')
                : (v.product || 'None');

             const isSample = v.sampleGiven;
             const followUp = v.nextFollowUp ? new Date(v.nextFollowUp).toLocaleDateString() : 'None';

             return (
               <div key={v._id} className="bg-white border border-[#E9ECEF] rounded-2xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/60"></div>
                  
                  <div className="flex justify-between items-start mb-3 ml-1">
                     <div>
                       <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block">Visit Date</span>
                       <p className="font-button text-on-surface text-lg">{new Date(v.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                         <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block mb-0.5">Sample</span>
                         <span className={`text-xs px-2 py-0.5 rounded font-bold ${isSample ? 'bg-[#25D366]/10 text-[#1DA851]' : 'bg-[#E9ECEF] text-outline'}`}>
                            {isSample ? 'Given' : 'No'}
                         </span>
                     </div>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E9ECEF] space-y-2 ml-1">
                     <div>
                       <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block">Discussed</span>
                       <p className="font-body-md text-sm font-medium">{productsList}</p>
                     </div>
                     
                     {v.notes && (
                       <div className="border-t border-[#E9ECEF] pt-2">
                         <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider block">Notes</span>
                         <p className="font-body-sm text-on-surface-variant italic line-clamp-3">{v.notes}</p>
                       </div>
                     )}
                     
                     <div className="border-t border-[#E9ECEF] pt-2 flex justify-between items-center">
                       <span className="font-label-caps text-[10px] text-outline uppercase tracking-wider">Next Follow-up</span>
                       <span className={`text-xs font-bold ${followUp !== 'None' ? 'text-primary' : 'text-outline'}`}>{followUp}</span>
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
