import React, { useState, useMemo, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, 
  ShoppingCart, 
  Loader2, 
  ArrowLeft, 
  Share2, 
  Printer, 
  Settings,
  FileText,
  Check,
  Download,
  Zap
} from 'lucide-react';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';

// Adjust path if your file structure is different
import MagicZoomClone from '../components/MagicZoomClone'; 

const { useParams, Link } = ReactRouterDOM;

// --- BRAND COLOR PLACEHOLDERS ---
const BRAND_ACCENT = "amber-500";
const BRAND_ACCENT_HOVER = "amber-600";
const BRAND_PRIMARY_TEXT = "slate-900";
const BRAND_SECONDARY_TEXT = "slate-600";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // --- SELECTION STATE ---
  const [selectedDia, setSelectedDia] = useState<string>('');
  const [selectedLen, setSelectedLen] = useState<string>('');
  
  // --- GALLERY STATE ---
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeImageOverride, setActiveImageOverride] = useState<string | null>(null);

  // --- MOBILE STATE ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Inject Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Rajdhani:wght@500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch Data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) throw new Error("No product slug provided");
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (productError) {
           const staticP = STATIC_PRODUCTS.find(p => p.slug === slug);
           if (staticP) {
             setProduct(staticP);
             setLoading(false);
             return;
           }
           throw productError;
        }

        const { data: vData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id);
        
        const apps = Array.isArray(productData.applications) 
            ? productData.applications 
            : [];

        const fullProduct = { ...productData, applications: apps, variants: vData || [] };
        setProduct(fullProduct);
        
        if (vData && vData.length > 0) {
            const dias = Array.from(new Set(vData.map((v: any) => v.diameter).filter(Boolean))).sort();
            if (dias.length > 0) setSelectedDia(dias[0] as string);
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // --- FILTERING LOGIC ---
  const uniqueDiameters = useMemo(() => {
      if (!product?.variants) return [];
      const dias = new Set(product.variants.map((v: any) => v.diameter).filter(Boolean));
      return Array.from(dias).sort(); 
  }, [product]);

  const availableLengths = useMemo(() => {
      if (!product?.variants || !selectedDia) return [];
      const lengths = new Set(
          product.variants.filter((v: any) => v.diameter === selectedDia).map((v: any) => v.length).filter(Boolean)
      );
      return Array.from(lengths).sort(); 
  }, [product, selectedDia]);

  useEffect(() => {
      if (availableLengths.length > 0 && !availableLengths.includes(selectedLen)) {
          setSelectedLen(availableLengths[0]);
      } else if (availableLengths.length === 0) {
          setSelectedLen('');
      }
  }, [selectedDia, availableLengths]);

  const availableFinishes = useMemo(() => {
      if (!product?.variants) return [];
      const relevantVariants = product.variants.filter((v: any) => v.diameter === selectedDia && v.length === selectedLen);
      return Array.from(new Set(relevantVariants.map((v: any) => v.finish).filter(Boolean)));
  }, [product, selectedDia, selectedLen]);

  const handleFinishClick = (finish: string) => {
      if (product.finish_images && product.finish_images[finish]) {
        setActiveImageOverride(product.finish_images[finish]);
        setSelectedImageIndex(0);
      } else {
        setActiveImageOverride(null); 
      }
  };

  const displayImages = useMemo(() => {
    let images = product?.images || ['https://via.placeholder.com/600x600?text=No+Image'];
    if (activeImageOverride) return [activeImageOverride, ...images];
    return images;
  }, [product, activeImageOverride]);


  const fontHeading = { fontFamily: '"Rajdhani", sans-serif' };
  const fontBody = { fontFamily: '"Inter", sans-serif' };

  if (loading) return (
    <div className={`h-screen w-full flex items-center justify-center bg-slate-50`}>
      <Loader2 className={`animate-spin text-${BRAND_ACCENT}`} size={48} />
    </div>
  );

  if (!product) return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-slate-50 text-${BRAND_PRIMARY_TEXT}`}>
      <h2 className="text-3xl font-bold mb-4" style={fontHeading}>Product Not Found</h2>
      <Link to="/products" className={`flex items-center gap-2 text-${BRAND_ACCENT} hover:text-${BRAND_ACCENT_HOVER} font-medium`}>
        <ArrowLeft /> Back to Catalog
      </Link>
    </div>
  );

  const currentImage = displayImages[selectedImageIndex];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 selection:bg-amber-100 selection:text-amber-900" style={fontBody}>
      
      {/* --- HEADER / BREADCRUMBS --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm bg-opacity-90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs font-bold tracking-[0.15em] uppercase text-slate-500" style={fontHeading}>
              <Link to="/products" className={`hover:text-${BRAND_ACCENT} transition-colors`}>Catalog</Link>
              <ChevronRight size={12} className="mx-2 opacity-50" />
              <span className={`text-${BRAND_PRIMARY_TEXT}`}>{product.category || "Fasteners"}</span>
            </div>
            <div className="flex gap-2 text-slate-400">
                <button className="hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"><Share2 size={18} /></button>
                <button onClick={() => window.print()} className="hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full"><Printer size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: PREMIUM GALLERY STAGE */}
          <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* --- IMAGE CONTAINER --- */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-slate-200 p-8 h-[500px] md:h-[600px] flex items-center justify-center group z-10">
                  
                  {/* Badge */}
                  <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-md pointer-events-none shadow-md" style={fontHeading}>
                    Premium Series
                  </div>
                  
                  <div className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                    <MagicZoomClone 
                      src={currentImage} 
                      zoomSrc={currentImage} 
                      alt={product.name}
                      zoomLevel={2.5}
                      glassSize={isMobile ? 120 : 220}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
              </div>

              {/* --- THUMBNAILS --- */}
              <div className="flex gap-4 overflow-x-auto py-2 px-1 no-scrollbar justify-center lg:justify-start">
                {displayImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`
                      relative w-24 h-24 rounded-xl bg-white overflow-hidden p-3 transition-all duration-300 border-2
                      ${selectedImageIndex === idx 
                        ? `border-${BRAND_ACCENT} shadow-lg scale-105 ring-2 ring-${BRAND_ACCENT}/20 z-10` 
                        : 'border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'}
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
          </div>

          {/* RIGHT: BUYING DECISION & CONFIGURATION */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="sticky top-24 space-y-8">
              
              {/* Title Header */}
              <div>
                <h1 className={`text-4xl md:text-5xl font-extrabold text-${BRAND_PRIMARY_TEXT} tracking-tight uppercase mb-4 leading-[1.1]`} style={fontHeading}>
                  {product.name}
                </h1>
                <p className={`text-${BRAND_SECONDARY_TEXT} text-lg leading-relaxed font-light border-l-4 border-${BRAND_ACCENT} pl-4`}>
                  {product.short_description}
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* --- VARIANT SELECTION PANEL --- */}
              <div className="space-y-6 py-2">
                
                {/* Diameter Select */}
                <div className="space-y-3">
                  <span className={`text-slate-500 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2`} style={fontHeading}>
                      <Settings size={14} className={`text-${BRAND_ACCENT}`} /> Diameter Select
                  </span>
                  <div className="flex flex-wrap gap-2">
                      {uniqueDiameters.map((dia: any) => (
                          <button
                              key={dia}
                              onClick={() => setSelectedDia(dia)}
                              className={`min-w-[70px] px-4 py-2.5 text-sm font-bold transition-all rounded-md border-2 ${
                                  selectedDia === dia 
                                  ? `bg-${BRAND_PRIMARY_TEXT} text-white border-${BRAND_PRIMARY_TEXT} shadow-lg scale-105` 
                                  : `bg-white text-${BRAND_SECONDARY_TEXT} border-slate-200 hover:border-${BRAND_ACCENT} hover:text-${BRAND_PRIMARY_TEXT}`
                              }`}
                              style={fontHeading}
                          >
                              {dia}
                          </button>
                      ))}
                  </div>
                </div>

                {/* Length Select */}
                <div className="space-y-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2" style={fontHeading}>
                    <Settings size={14} className={`text-${BRAND_ACCENT}`} /> Length Select
                  </span>
                  <div className="flex flex-wrap gap-2">
                      {availableLengths.length > 0 ? availableLengths.map(len => (
                          <button
                              key={len}
                              onClick={() => setSelectedLen(len)}
                              className={`min-w-[70px] px-4 py-2.5 text-sm font-bold transition-all rounded-md border-2 ${
                                  selectedLen === len 
                                  ? `bg-${BRAND_PRIMARY_TEXT} text-white border-${BRAND_PRIMARY_TEXT} shadow-lg scale-105` 
                                  : `bg-white text-${BRAND_SECONDARY_TEXT} border-slate-200 hover:border-${BRAND_ACCENT} hover:text-${BRAND_PRIMARY_TEXT}`
                              }`}
                              style={fontHeading}
                          >
                              {len}
                          </button>
                      )) : (
                          <span className="text-slate-400 italic text-sm px-2">Please select diameter first.</span>
                      )}
                  </div>
                </div>

                {/* Finish Select */}
                <div className="space-y-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2" style={fontHeading}>
                      Finish Options
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableFinishes.length > 0 ? availableFinishes.map((finish: any) => (
                      <button
                          key={finish}
                          onClick={() => handleFinishClick(finish)}
                          className={`px-5 py-2 text-xs font-bold uppercase tracking-wider border-2 rounded-full transition-all duration-200 group ${
                            activeImageOverride === product.finish_images?.[finish]
                             ? `border-${BRAND_ACCENT} text-${BRAND_PRIMARY_TEXT} bg-amber-50`
                             : `border-slate-300 text-slate-600 hover:border-${BRAND_ACCENT} hover:text-${BRAND_ACCENT}`
                          }`}
                          style={fontHeading}
                      >
                          <span className={`w-2 h-2 rounded-full bg-slate-300 inline-block mr-2 group-hover:bg-${BRAND_ACCENT}`}></span>
                          {finish}
                      </button>
                    )) : (
                      <span className="text-slate-400 italic text-sm px-2">
                          {selectedDia && selectedLen ? "Standard finish only" : "Select size options first."}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* --- END VARIANT SELECTION --- */}

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className={`flex-1 bg-${BRAND_ACCENT} text-white text-center text-sm font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-lg shadow-lg shadow-${BRAND_ACCENT}/30 hover:bg-${BRAND_ACCENT_HOVER} hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3`} style={fontHeading}>
                  <ShoppingCart size={20} /> Request Quote
                </Link>
                <button className={`flex-1 bg-white text-${BRAND_PRIMARY_TEXT} border-2 border-slate-200 text-sm font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-lg hover:border-${BRAND_PRIMARY_TEXT} hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm`} style={fontHeading}>
                  <FileText size={20} /> Spec Sheet
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- DETAILED CONTENT SECTIONS (FIXED LAYOUT) --- */}
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          
          {/* SECTION: Technical Specs & Drawing (2-Column Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-start">
            
            {/* LEFT COLUMN: Data Table */}
            <div>
              <h3 className={`text-2xl font-bold text-${BRAND_PRIMARY_TEXT} mb-6 flex items-center gap-3 uppercase tracking-wider`} style={fontHeading}>
                  <Settings className={`text-${BRAND_ACCENT}`} /> Technical Specifications
              </h3>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Parameter</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Specification</span>
                </div>

                {/* Table Body */}
                <div className="p-6 pt-2 divide-y divide-slate-100">
                  {product.material && <SpecRow label="Material" value={product.material} />}
                  {product.head_type && <SpecRow label="Head Type" value={product.head_type} />}
                  {product.thread_type && <SpecRow label="Thread Type" value={product.thread_type} />}
                  {/* Remove these if you only want dynamic data */}
                  <SpecRow label="Drive Type" value="Phillips (PH2)" /> 
                  <SpecRow label="Corrosion Resistance" value="High (Grade 4)" />
                </div>

                {/* Table Footer / Download */}
                <div className="bg-amber-50 px-6 py-4 border-t border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                            <FileText size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Full Data Sheet</span>
                            <span className="text-[10px] text-slate-500">PDF • 2.4 MB</span>
                        </div>
                    </div>
                    <button className={`text-xs font-bold text-white bg-${BRAND_ACCENT} hover:bg-${BRAND_ACCENT_HOVER} px-4 py-2 rounded-lg transition-colors uppercase tracking-wider`}>
                        Download
                    </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dimensional Drawing */}
           {/* RIGHT COLUMN: Dimensional Drawing */}
            <div>
              <h3 className={`text-2xl font-bold text-${BRAND_PRIMARY_TEXT} mb-6 flex items-center gap-3 uppercase tracking-wider`} style={fontHeading}>
                <Zap className={`text-${BRAND_ACCENT}`} /> Dimensional Drawing
              </h3>

              {/* DRAWING CARD */}
              <div className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                
                {/* 1. Engineering Grid Background */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* 2. ISO Badge */}
                <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded border border-slate-200 uppercase tracking-widest z-10">
                  ISO Standard
                </div>

                {/* 3. The Image - UPDATED HERE */}
                <div className="relative z-10 flex justify-center py-8">
                    <img 
                      /* Make sure your file is named 'tech-drawing.png' and is in the public folder */
                      src="/technical.jpeg" 
                      alt="Technical Dimensional Drawing" 
                      /* 'mix-blend-multiply' makes the white background of the image transparent so it blends with the grid */
                      className="max-h-[280px] w-auto mix-blend-multiply" 
                    />
                </div>

                {/* 4. The Legend (Matches your image labels: dk, L, d) */}
                <div className="relative z-10 mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                    <div className="text-center group cursor-default">
                        <span className={`block text-xl font-bold text-slate-900 group-hover:text-${BRAND_ACCENT} transition-colors`} style={fontHeading}>dk</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Head Dia</span>
                    </div>
                    <div className="text-center border-l border-slate-100 border-r group cursor-default">
                        <span className={`block text-xl font-bold text-slate-900 group-hover:text-${BRAND_ACCENT} transition-colors`} style={fontHeading}>L</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Length</span>
                    </div>
                    <div className="text-center group cursor-default">
                        <span className={`block text-xl font-bold text-slate-900 group-hover:text-${BRAND_ACCENT} transition-colors`} style={fontHeading}>d</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Thread Dia</span>
                    </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION: Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="mb-20">
                <div className="text-center mb-12">
                  <h3 className={`text-3xl font-bold text-${BRAND_PRIMARY_TEXT} uppercase tracking-wider`} style={fontHeading}>
                    Industry Applications
                  </h3>
                  <div className={`w-20 h-1 bg-${BRAND_ACCENT} mx-auto mt-4 rounded-full`}></div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {product.applications.map((app: string, idx: number) => (
                        <div key={idx} className="group bg-white border border-slate-200 p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-amber-400 hover:shadow-[0_10px_30px_-10px_rgba(251,191,36,0.2)] transition-all duration-300 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            <div className={`w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-${BRAND_ACCENT} group-hover:scale-110 transition-transform shadow-sm group-hover:bg-${BRAND_ACCENT} group-hover:text-white`}>
                                <Check size={28} strokeWidth={2.5} />
                            </div>
                            <span className={`text-${BRAND_PRIMARY_TEXT} text-xs font-bold uppercase tracking-widest leading-tight relative z-10`} style={fontHeading}>
                                {app}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* SECTION: Downloads / Certs (Full Width) */}
          <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
               <div>
                 <h3 className="text-3xl font-bold uppercase tracking-wider mb-6" style={fontHeading}>Compliance & Certs</h3>
                 <p className="text-slate-300 mb-8 max-w-md font-light">We adhere to strict international manufacturing standards.</p>
                 <div className="flex flex-wrap gap-4">
                   <div className="text-center"><div className="text-4xl font-black mb-2" style={fontHeading}>ISO</div><div className="text-xs text-slate-400">9001:2015</div></div>
                   <div className="w-px h-12 bg-white/10 mx-4"></div>
                   <div className="text-center"><div className="text-4xl font-black mb-2" style={fontHeading}>CE</div><div className="text-xs text-slate-400">Certified</div></div>
                   <div className="w-px h-12 bg-white/10 mx-4"></div>
                   <div className="text-center"><div className="text-4xl font-black mb-2" style={fontHeading}>RoHS</div><div className="text-xs text-slate-400">Compliant</div></div>
                 </div>
               </div>
               <div className="flex justify-center md:justify-end">
                  <button className={`flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-${BRAND_ACCENT} hover:text-white transition-all`}>
                    <Download size={20} /> Download All Assets
                  </button>
               </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Simple Corporate Footer */}
      <footer className="bg-white py-8 border-t border-slate-200 text-center text-slate-500 text-sm font-medium" style={fontBody}>
        <p>© {new Date().getFullYear()} Industrial Solutions Corp. All rights reserved.</p>
      </footer>

    </div>
  );
};

// --- HELPER COMPONENTS ---

const SpecRow: React.FC<{label: string, value: string}> = ({label, value}) => (
  <div className="grid grid-cols-[160px_1fr] py-4 items-center">
    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em]">{label}</span>
    <span className={`text-${BRAND_PRIMARY_TEXT} text-base font-semibold font-rajdhani`}>{value}</span>
  </div>
);

const DownloadButton: React.FC<{label: string, size: string, icon?: React.ReactNode}> = ({label, size, icon = <Download size={18} />}) => (
  <button className={`flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-lg transition-all group`}>
    <span className={`text-${BRAND_ACCENT} group-hover:text-white transition-colors`}>{icon}</span>
    <div className="text-left">
      <div className="text-xs font-bold uppercase tracking-wider" style={{fontFamily: '"Rajdhani", sans-serif'}}>{label}</div>
      <div className="text-[10px] text-white/70">{size}</div>
    </div>
  </button>
)

export default ProductDetail;