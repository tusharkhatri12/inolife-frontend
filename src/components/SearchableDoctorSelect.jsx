import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

export default function SearchableDoctorSelect({ value, onChange, name }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newDocData, setNewDocData] = useState({ name: '', area: '', specialty: '', category: '' });
  const containerRef = useRef(null);

  // Fetch doctors
  const fetchDoctors = () => {
    api.getDoctors().then(data => setDoctors(data)).catch(console.error);
  };

  useEffect(() => {
    fetchDoctors();
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

  const selectedDoctor = doctors.find(d => d._id === value);
  const filteredDoctors = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (docId) => {
    onChange({ target: { name, value: docId } });
    setIsOpen(false);
    setSearch('');
  };

  const handleAddNewSubmit = async (e) => {
    e.preventDefault();
    if (!newDocData.name) return;
    setLoading(true);
    try {
      const inserted = await api.createDoctor(newDocData);
      
      // update doctors list
      setDoctors(prev => {
        let updated = [...prev];
        if (inserted.__offlineSaved) {
            // Fake an id so it selects immediately offline
            updated.push({ _id: 'temp_' + Date.now(), ...newDocData });
        } else {
            updated.push(inserted);
        }
        // sort by name
        return updated.sort((a,b) => a.name.localeCompare(b.name));
      });
      
      // auto select
      handleSelect(inserted._id || ('temp_' + Date.now()));
      
      setShowAddModal(false);
      setNewDocData({ name: '', area: '', specialty: '', category: '' });
      alert("Doctor added successfully");
    } catch(err) {
      alert("Error adding doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Target input looks like a select but is clickable */}
      <div 
        className="w-full h-[48px] px-md bg-white border border-[#E9ECEF] rounded-lg flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedDoctor ? 'text-on-background' : 'text-outline italic'}>
          {selectedDoctor ? `${selectedDoctor.name}` : 'None / Pick doctor'}
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
              placeholder="Search doctors..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredDoctors.map(doc => (
              <div 
                key={doc._id} 
                onClick={() => handleSelect(doc._id)}
                className="px-md py-sm hover:bg-surface-container-highest cursor-pointer border-b border-[#E9ECEF]/50 last:border-0"
              >
                <p className="font-body-md whitespace-nowrap overflow-hidden text-ellipsis">{doc.name}</p>
                {doc.area && doc.area !== 'General' && <span className="text-xs text-outline">{doc.area}</span>}
              </div>
            ))}
            {filteredDoctors.length === 0 && search && (
              <div className="p-md text-center text-outline text-sm">No doctors found matching "{search}"</div>
            )}
          </div>
          
          {/* Add New Doctor sticky button at bottom */}
          <div 
             className="p-sm bg-primary/5 text-primary border-t border-primary/20 font-button text-center cursor-pointer hover:bg-primary/10 transition-colors"
             onClick={() => {
                setIsOpen(false);
                setNewDocData(prev => ({ ...prev, name: search })); // pre-fill name with what they searched
                setShowAddModal(true);
             }}
          >
             + Add New Doctor
          </div>
        </div>
      )}

      {/* Add New Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-lg shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-h2 text-h2">Add New Doctor</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-background">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddNewSubmit} className="space-y-sm">
              <div>
                <label className="font-label-caps block mb-1">Doctor Name *</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newDocData.name} 
                  onChange={e => setNewDocData({...newDocData, name: e.target.value})} 
                  className="w-full h-12 px-3 border border-[#E9ECEF] rounded-lg outline-primary"
                  placeholder="e.g. Dr. John Doe"
                />
              </div>
              <div>
                <label className="font-label-caps block mb-1">Area (Optional)</label>
                <input 
                  type="text" 
                  value={newDocData.area} 
                  onChange={e => setNewDocData({...newDocData, area: e.target.value})} 
                  className="w-full h-12 px-3 border border-[#E9ECEF] rounded-lg outline-primary"
                />
              </div>
              <div>
                <label className="font-label-caps block mb-1">Specialty (Optional)</label>
                <input 
                  type="text" 
                  value={newDocData.specialty} 
                  onChange={e => setNewDocData({...newDocData, specialty: e.target.value})} 
                  className="w-full h-12 px-3 border border-[#E9ECEF] rounded-lg outline-primary"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-primary text-white rounded-xl shadow active:scale-95 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
