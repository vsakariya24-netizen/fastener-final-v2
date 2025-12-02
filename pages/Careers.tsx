import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Briefcase, 
  Users, 
  Heart, 
  Globe, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  IndianRupee, 
  Clock,       
  CheckCircle,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- HELPER TO CLEAN SKILLS ---
// This splits text by Commas (,) OR Asterisks (*) OR Newlines
const parseSkills = (skillString: string) => {
  if (!skillString) return [];
  return skillString
    .split(/[,*•\n]/) // Split by comma, asterisk, bullet, or enter key
    .map(s => s.trim()) // Remove extra spaces
    .filter(s => s.length > 2); // Remove empty or tiny strings
};

const getBadgeColor = (text: string) => {
  const t = text ? text.toLowerCase() : '';
  if (t.includes('engineering') || t.includes('manufacturing')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (t.includes('sales') || t.includes('marketing')) return 'bg-green-100 text-green-800 border-green-200';
  if (t.includes('quality')) return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      // ⚠️ IMPORTANT: Verify these column names in your Supabase Table
      const { data, error } = await supabase
        .from('jobs')
        .select('*') 
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (!error && data) setJobs(data);
      if (error) console.error("Error fetching jobs:", error);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-white font-sans selection:bg-yellow-100">
      
      {/* (Hero Section Code remains same as before...) */}
      <div className="relative bg-zinc-900 text-white pt-32 pb-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
             <h1 className="text-4xl md:text-6xl font-black mb-4">Open Positions</h1>
             <p className="text-zinc-400">Build the future with us.</p>
          </div>
      </div>

      {/* --- JOB LISTINGS --- */}
      <div id="openings" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          
          {loading ? (
             <p className="text-center text-gray-500">Loading jobs...</p>
          ) : (
            <div className="grid gap-8">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    
                    {/* Header: Title & Badges */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                      <div>
                        <div className="flex gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getBadgeColor(job.department)}`}>
                            {job.department}
                          </span>
                          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-zinc-900">{job.title}</h3>
                      </div>
                      
                      <div className="mt-6 lg:mt-0 flex-shrink-0 flex flex-col items-start lg:items-end gap-3">
  {/* 👇 CHANGE IS HERE: Use <a> tag instead of <Link> */}
  <a 
    href="https://docs.google.com/forms/d/e/1FAIpQLSf50Guc1aD2pfAEjrrTQmtDtaZn2zZUvmlUN5QCL8IazYAj5w/viewform" 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center w-full lg:w-auto px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
  >
    Apply Now <ArrowRight size={16} className="ml-2" />
  </a>
  
  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
     <Clock size={12} /> Posted recently
  </span>
</div>
                    </div>

                    {/* --- INFO GRID (Fixed Design) --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {/* Experience */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Experience</p>
                                {/* Displays whatever is in DB, e.g. "0-2 Years" */}
                                <p className="text-sm font-bold text-zinc-800">
                                    {job.experience || 'Not Specified'} 
                                </p>
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-800">
            {job.salary_range || job.salary || job.Salary || job.pay || 'Competitive'}
        </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-gray-400">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location</p>
                                <p className="text-sm font-bold text-zinc-800">
                                    {job.location || 'Rajkot, Gujarat'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {job.description}
                    </p>

                    {/* --- FIXED SKILLS SECTION --- */}
                    {job.skills && (
                      <div className="border-t border-gray-100 pt-6">
                          <p className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                             <Hash size={16} className="text-yellow-500"/> Required Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                              {parseSkills(job.skills).map((skill, idx) => (
                                  <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-50 text-zinc-700 border border-zinc-200 hover:border-yellow-400 transition-colors">
                                      {skill}
                                  </span>
                              ))}
                          </div>
                      </div>
                    )}
                    
                    {/* Mobile Apply Button */}
                    <div className="mt-8 md:hidden">
                        <Link 
                            to="/contact" 
                            className="w-full flex justify-center items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Apply Now <ArrowRight size={18} />
                        </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Careers;