import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Briefcase, IndianRupee, Code, MapPin } from 'lucide-react';

const AddJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Rajkot, Gujarat',
    experience: '',
    salary: '',
    skills: '', // Comma separated
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('jobs').insert([formData]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      navigate('/admin/jobs');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/admin/jobs" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black transition-colors">
        <ArrowLeft size={18} /> Back to Jobs List
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Post a New Position</h2>
          <p className="text-gray-500 mt-1">Fill in the details to publish a job card like Naukri.com</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase size={16} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
                  placeholder="e.g. Senior Automobile Technician"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Manufacturing</option>
                  <option>Sales & Marketing</option>
                  <option>Quality Assurance</option>
                  <option>HR & Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Specifics (The Naukri Style Data) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={16} /> Specifics (For Card Display)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Yrs)</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg" 
                    placeholder="e.g. 0-5 Yrs"
                    value={formData.experience}
                    onChange={e => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <div className="relative">
                  <IndianRupee size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg" 
                    placeholder="e.g. ₹ 2.5 - 5 Lacs PA"
                    value={formData.salary}
                    onChange={e => setFormData({...formData, salary: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg" 
                    placeholder="e.g. Rajkot, Gujarat"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
                <div className="relative">
                  <Code size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg" 
                    placeholder="e.g. AutoCAD, CNC Programming, Quality Control"
                    value={formData.skills}
                    onChange={e => setFormData({...formData, skills: e.target.value})}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">These will appear as tags at the bottom of the card.</p>
              </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description / Requirements</label>
            <textarea 
              required
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all" 
              placeholder="Describe the role, responsibilities, and key requirements..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
            >
              {loading ? 'Publishing...' : <><Save size={20} /> Publish Job Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;