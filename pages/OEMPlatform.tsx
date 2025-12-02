import React from 'react';
import { Ruler, Cpu, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OEMPlatform: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative bg-[#050505] text-white pt-32 pb-24 px-4 overflow-hidden">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-block px-3 py-1 border border-brand-yellow/30 rounded-full bg-brand-yellow/10 mb-6">
            <span className="text-brand-yellow text-xs font-bold tracking-widest uppercase">Original Equipment Manufacturing</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Precision Engineering <br />
            <span className="text-brand-yellow">Tailored to Your Blueprint</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            We transform your CAD designs into high-performance fasteners. 
            From prototyping to mass production, Durable Fastener is your strategic manufacturing partner.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto bg-brand-yellow text-brand-dark px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              Start a Project <ArrowRight size={18} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold border border-gray-700 hover:border-white hover:bg-white/5 transition-all">
              View Capabilities
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- PROCESS SECTION ---------------- */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">From Concept to Reality</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined OEM process ensures speed, accuracy, and scalability for your custom requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Ruler size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Consultation</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We analyze your technical drawings, load requirements, and material specifications to ensure feasibility.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Prototyping</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Rapid sample creation for stress testing, fitment verification, and client approval before bulk run.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Production</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                High-volume manufacturing using automated CNC systems with strict tolerance control.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">4. QA & Delivery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                100% defect screening, certification generation, and global logistics handling.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OEMPlatform;