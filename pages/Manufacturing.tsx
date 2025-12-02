import React from 'react';
import { Settings, ShieldCheck, Truck, Package } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

const Manufacturing: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      <div className="bg-gray-100 py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Manufacturing Excellence</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Combining advanced technology with strict quality control to deliver precision fasteners for global industries.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Facility Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
           <div className="lg:w-1/2">
             <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden relative group">
               {/* Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                 <Settings size={64} className="text-gray-400" />
               </div>
               <div className="absolute bottom-0 left-0 w-full bg-black/60 p-4 text-white">
                 <p className="font-bold">7000 Sq. Ft. Integrated Facility</p>
               </div>
             </div>
           </div>
           <div className="lg:w-1/2">
             <div className="inline-block bg-brand-yellow/20 text-brand-dark px-3 py-1 rounded-full text-xs font-bold mb-4">
               INFRASTRUCTURE
             </div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6">State-of-the-Art Production</h2>
             <p className="text-gray-600 mb-4 leading-relaxed">
               Durable Fastener Pvt. Ltd. has expanded its operational footprint to a massive <strong>7000 square foot facility</strong> located in Rajkot, Gujarat. This expansion allows us to maintain high inventory levels and streamline our supply chain.
             </p>
             <p className="text-gray-600 mb-6 leading-relaxed">
               Our facility is equipped to handle bulk requirements for OEM (Original Equipment Manufacturer) partners, ensuring consistency in specification and finish across large batches.
             </p>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-bold text-gray-900">350+</h4>
                 <p className="text-sm text-gray-500">Suppliers Network</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-bold text-gray-900">Pan-India</h4>
                 <p className="text-sm text-gray-500">Logistics Reach</p>
               </div>
             </div>
           </div>
        </div>

        {/* Quality Process */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Quality Assurance</h2>
            <p className="text-gray-500 mt-2">Strict adherence to international standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Material Testing</h3>
              <p className="text-gray-600 text-sm">
                We use strictly graded materials (Mild Steel Grade-1022, SS304, SS316) to ensure tensile strength and corrosion resistance.
              </p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Precision Engineering</h3>
              <p className="text-gray-600 text-sm">
                Advanced heading and threading machinery ensures accurate dimensions (Diameter, Length) with zero tolerance for errors.
              </p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-shadow bg-white">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Inventory Control</h3>
              <p className="text-gray-600 text-sm">
                Robust inventory methods are applied to ensure stock availability for immediate dispatch and order fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* Packing Section */}
        <div className="bg-brand-dark text-white rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Premium Shipment Packing</h2>
              <p className="text-gray-400 mb-6 max-w-xl">
                We ensure your products arrive in perfect condition with our multi-tier packing solutions: Plastic Box, Corrugated Box, and Carton Pack.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark px-6 py-3 rounded-lg font-bold hover:bg-white transition-colors">
                Partner With Us <Truck size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Visual representation of packing types */}
              <div className="w-24 h-24 bg-white/10 rounded-lg flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-bold text-gray-300">Plastic Box</span>
              </div>
               <div className="w-24 h-24 bg-white/10 rounded-lg flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-bold text-gray-300">Corrugated</span>
              </div>
               <div className="w-24 h-24 bg-white/10 rounded-lg flex flex-col items-center justify-center text-center p-2">
                <span className="text-xs font-bold text-gray-300">Carton</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Manufacturing;