import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Hash, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Clock,
  Sparkles,
  MessageCircle // 1. Icon Import kiya
} from 'lucide-react';

// --- HELPERS ---
const parseSkills = (skillString: string) => {
  if (!skillString) return [];
  return skillString.split(/[,*•\n]/).map(s => s.trim()).filter(s => s.length > 2); 
};

const getBadgeColor = (text: string) => {
  const t = text ? text.toLowerCase() : '';
  if (t.includes('engineering') || t.includes('manufacturing')) return 'bg-blue-50 text-blue-700 border-blue-100';
  if (t.includes('sales') || t.includes('marketing')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (t.includes('finance') || t.includes('account')) return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-gray-50 text-gray-700 border-gray-100';
};

// --- JOB CARD COMPONENT ---
const JobCard: React.FC<{ job: any }> = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- 1. APNA NUMBER YAHAN DALEIN ---
  const phoneNumber = "918758700783"; 

  // --- 2. MESSAGE SET KAREIN ---
  const message = `Hello, I am interested in the position of *${job.title}* at Durable Fastener. Please guide me on how to apply.`;

  // --- 3. SMART LOGIC (Mobile vs PC) ---
  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check karein ki user Mobile par hai ya PC par
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let url = "";

    if (isMobile) {
      // Mobile hai toh App khulega
      url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    } else {
      // Laptop/PC hai toh seedha WhatsApp Web khulega
      url = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    }

    // New Tab mein open karein
    window.open(url, '_blank');
  };
 return (
    <div className="group relative bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 md:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getBadgeColor(job.department)}`}>
                {job.department}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
                <Clock size={12} /> {job.type}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight group-hover:text-blue-900 transition-colors">
              {job.title}
            </h3>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm
              ${isOpen 
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md'
              }`}
          >
            {isOpen ? 'Close Details' : 'View Details'}
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 group-hover:border-gray-200 transition-colors">
            <div className="bg-white p-3 rounded-xl shadow-sm text-gray-400">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Experience</p>
              <p className="text-sm font-bold text-gray-900">{job.experience || 'Not Specified'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 group-hover:border-gray-200 transition-colors">
            <div className="bg-white p-3 rounded-xl shadow-sm text-gray-400">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Salary</p>
              <p className="text-sm font-bold text-gray-900">{job.salary || 'Competitive'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 group-hover:border-gray-200 transition-colors">
            <div className="bg-white p-3 rounded-xl shadow-sm text-gray-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-bold text-gray-900">{job.location || 'Rajkot, Gujarat'}</p>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        <div 
          className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-gray-100 pt-8">
              
              <div 
                className="prose prose-zinc max-w-none 
                  prose-headings:font-black prose-headings:text-gray-900 
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-li:text-gray-600 prose-li:marker:text-gray-300
                  prose-strong:text-gray-900 prose-strong:font-bold"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />

              {job.skills && (
                <div className="mt-10 mb-8">
                  <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Hash size={16} className="text-yellow-500"/> Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parseSkills(job.skills).map((skill, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Call To Action Box (Green Theme for WhatsApp) */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-green-100 opacity-50 rotate-12">
                  <MessageCircle size={150} />
                </div>

                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Sparkles size={20} className="text-green-600 fill-green-600" />
                    Ready to join?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Chat directly with our HR team on WhatsApp to apply.
                  </p>
                </div>

                {/* 4. BUTTON CLICK HANDLER UPDATED */}
                <button 
                  onClick={handleApplyClick}
                  className="relative z-10 flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle size={20} /> Apply via WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
// --- MAIN PAGE ---
const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error && data) setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-white font-sans selection:bg-yellow-100 min-h-screen flex flex-col">
      <div className="bg-zinc-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="max-w-7xl mx-auto text-center relative z-10">
             <span className="inline-block py-1 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 mb-4 tracking-wide uppercase">Join Our Team</span>
             <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">Current <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">Openings</span></h1>
             <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Be part of the Durable Fastener success story.</p>
          </div>
      </div>

      <div className="flex-grow py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
             <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>
          ) : (
            <div className="grid gap-8">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              {jobs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Briefcase size={32} /></div>
                  <h3 className="text-xl font-bold text-gray-900">No positions available</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Careers;
