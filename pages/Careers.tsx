import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Briefcase, MapPin, IndianRupee, ChevronDown, ChevronUp, Send, 
  Clock, Sparkles, Search, Filter, X, Building2, Users
} from 'lucide-react';

// --- HELPERS ---
const getBadgeColor = (text: string) => {
  const t = text ? text.toLowerCase() : '';
  if (t.includes('engineer') || t.includes('manufactur') || t.includes('dispatch')) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (t.includes('sales') || t.includes('market') || t.includes('export')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (t.includes('financ') || t.includes('account')) return 'bg-amber-50 text-amber-700 border-amber-100';
  if (t.includes('admin') || t.includes('hr') || t.includes('found')) return 'bg-purple-50 text-purple-700 border-purple-100';
  return 'bg-gray-50 text-gray-700 border-gray-100';
};

// --- JOB CARD COMPONENT ---
const JobCard: React.FC<{ job: any }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
    // Default to a generic number if not specific
    const phoneNumber = "919876543210"; 
    const message = `Hello, I am interested in the position of *${job.title}* at Durable Fastener.`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile 
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeColor(job.department)}`}>
                {job.department}
              </span>
              {job.location && (
                 <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
                   <MapPin size={10} /> {job.location}
                 </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-blue-900 transition-colors">
              {job.title}
            </h3>
          </div>
          <div className="flex-shrink-0">
             <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                <IndianRupee size={14} /> {job.salary || 'Best in Industry'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2"><Briefcase size={16} /> {job.experience || 'Exp. Req'}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> Full Time</div>
        </div>

        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-all text-sm"
        >
          <span>{isOpen ? 'Hide Description' : 'View Job Description'}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <div className="mt-6 animate-fadeIn">
            {/* HTML Description Renderer */}
            <div 
                className="prose prose-sm prose-zinc max-w-none 
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-4 prose-headings:mb-2
                prose-p:text-gray-600 prose-li:text-gray-600 prose-li:my-0
                prose-strong:text-gray-900" 
                dangerouslySetInnerHTML={{ __html: job.description }} 
            />
            
            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">Interested in this role?</p>
                <p className="text-gray-500 text-xs">Direct WhatsApp application.</p>
              </div>
              <button onClick={handleApply} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all">
                <Send size={18} /> Apply Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SIDEBAR FILTER COMPONENT ---
const FilterSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  options: { label: string; count: number }[];
  selected: string[];
  onChange: (val: string) => void;
}> = ({ title, icon, options, selected, onChange }) => {
  if (options.length === 0) return null;
  return (
    <div className="mb-8">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            {icon} {title}
        </h4>
        <div className="space-y-3">
            {options.map((opt) => (
                <label key={opt.label} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selected.includes(opt.label) ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                            {selected.includes(opt.label) && <div className="w-2 h-2 bg-white rounded-sm" />}
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={selected.includes(opt.label)}
                                onChange={() => onChange(opt.label)}
                            />
                        </div>
                        <span className={`text-sm transition-colors ${selected.includes(opt.label) ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {opt.label}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {opt.count}
                    </span>
                </label>
            ))}
        </div>
    </div>
  );
};

// --- MAIN PAGE ---
const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    // 1. Fetch from Supabase
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    
    if (!error && data) {
      setJobs(data);
    } else {
        // Fallback or Error handling
        console.error("Error fetching jobs", error);
    }
    setLoading(false);
  };

  // --- DERIVED DATA FOR FILTER COUNTS ---
  // We calculate counts based on the *entire* dataset, not the filtered one (usually standard UX)
  const filterOptions = useMemo(() => {
    const depts: Record<string, number> = {};
    const locs: Record<string, number> = {};

    jobs.forEach(job => {
        // Department Count
        const d = job.department || 'Other';
        depts[d] = (depts[d] || 0) + 1;

        // Location Count (Handle "Rajkot / Surat" scenarios by splitting)
        // If your DB has "Rajkot" and "Surat" as separate clean fields, simplify this.
        const lList = job.location ? job.location.split('/').map((s:string) => s.trim()) : ['Remote'];
        lList.forEach((l: string) => {
             // Simple cleanup to group "Surat Branch" and "Surat" together if data is messy
             const cleanL = l.includes('Surat') ? 'Surat' : l.includes('Rajkot') ? 'Rajkot' : l;
             locs[cleanL] = (locs[cleanL] || 0) + 1;
        });
    });

    return {
        departments: Object.entries(depts).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
        locations: Object.entries(locs).map(([label, count]) => ({ label, count })).sort((a,b) => b.count - a.count),
    };
  }, [jobs]);

  // --- FILTERING LOGIC ---
  const filteredJobs = jobs.filter(job => {
    // 1. Search
    const searchContent = `${job.title} ${job.description} ${job.department}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

    // 2. Department (OR Logic: Sales OR HR)
    const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(job.department);

    // 3. Location (OR Logic)
    // We check if the job.location string contains ANY of the selected locations
    const matchesLoc = selectedLocs.length === 0 || selectedLocs.some(loc => job.location.includes(loc));

    return matchesSearch && matchesDept && matchesLoc;
  });

  const toggleFilter = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepts([]);
    setSelectedLocs([]);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-zinc-900 text-white pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
             <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Open Positions</h1>
             <p className="text-zinc-400 text-lg">Join the Durable Fastener team.</p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* MOBILE FILTER BAR */}
        <div className="lg:hidden mb-6 sticky top-20 z-20">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-lg focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className={`p-3 rounded-xl border shadow-lg flex items-center justify-center ${selectedDepts.length + selectedLocs.length > 0 ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}
                >
                    <Filter size={20} />
                    {(selectedDepts.length + selectedLocs.length > 0) && 
                        <span className="ml-2 text-xs font-bold bg-white text-black px-1.5 py-0.5 rounded-full">{selectedDepts.length + selectedLocs.length}</span>
                    }
                </button>
            </div>
        </div>

        {/* LAYOUT GRID */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* SIDEBAR (Desktop) */}
            <aside className={`
                lg:w-64 w-full bg-white lg:block
                ${showMobileFilters ? 'fixed inset-0 z-50 p-6 overflow-y-auto animate-fadeIn' : 'hidden'}
                lg:static lg:p-0 lg:z-auto lg:overflow-visible
            `}>
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                </div>

                <div className="lg:sticky lg:top-24 space-y-8">
                    {/* Desktop Search */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Keyword search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none text-sm"
                        />
                    </div>

                    {/* Active Filters Summary */}
                    {(selectedDepts.length > 0 || selectedLocs.length > 0) && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Active Filters</span>
                                <button onClick={clearFilters} className="text-xs font-bold text-red-600 hover:underline">Clear All</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...selectedDepts, ...selectedLocs].map(f => (
                                    <span key={f} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700 flex items-center gap-1 shadow-sm">
                                        {f} 
                                        <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => {
                                            if(selectedDepts.includes(f)) toggleFilter(f, selectedDepts, setSelectedDepts);
                                            else toggleFilter(f, selectedLocs, setSelectedLocs);
                                        }}/>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <FilterSection 
                        title="Department" 
                        icon={<Briefcase size={14}/>}
                        options={filterOptions.departments} 
                        selected={selectedDepts} 
                        onChange={(val) => toggleFilter(val, selectedDepts, setSelectedDepts)} 
                    />

                    <FilterSection 
                        title="Location" 
                        icon={<MapPin size={14}/>}
                        options={filterOptions.locations} 
                        selected={selectedLocs} 
                        onChange={(val) => toggleFilter(val, selectedLocs, setSelectedLocs)} 
                    />

                     {/* Mobile Apply Button */}
                     <div className="lg:hidden mt-8">
                        <button onClick={() => setShowMobileFilters(false)} className="w-full bg-black text-white font-bold py-3 rounded-xl">
                            Show {filteredJobs.length} Results
                        </button>
                     </div>
                </div>
            </aside>

            {/* JOB LIST AREA */}
            <main className="flex-1 w-full">
                <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">All Jobs</h2>
                        <p className="text-sm text-gray-500">Find the perfect role for you</p>
                    </div>
                    <span className="text-sm font-bold bg-black text-white px-3 py-1 rounded-full">{filteredJobs.length}</span>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400 animate-pulse">Loading positions...</div>
                ) : (
                    <div className="space-y-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                                <p className="text-gray-500">Try changing your filters or search terms.</p>
                                <button onClick={clearFilters} className="mt-4 text-sm font-bold text-blue-600 hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default Careers;