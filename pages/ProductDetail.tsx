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
  Check,
  Box,
  FileText,
  Settings,
  ZoomIn,   
  Rotate3D   
} from 'lucide-react';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';

const { useParams, Link } = ReactRouterDOM;

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

  // --- MAGNIFYING GLASS STATE (BILORY EFFECT) ---
  // We store width/height here to ensure the lens works immediately without ref errors
  const [magnifierState, setMagnifierState] = useState({
    show: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  // Configuration for the "Glass"
  const MAGNIFIER_SIZE = 200; // Size of the circular glass in px
  const ZOOM_LEVEL = 2.5;     // How much to magnify

  // Inject Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Rajdhani:wght@500;600;700&display=swap';
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
        
        const fullProduct = { ...productData, variants: vData || [] };
        setProduct(fullProduct);
        
        if (vData && vData.length > 0) {
            setSelectedDia(vData[0].diameter);
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
    let images = product?.images || ['https://via.placeholder.com/600?text=No+Image'];
    if (activeImageOverride) return [activeImageOverride, ...images];
    return images;
  }, [product, activeImageOverride]);

  // --- MAGNIFIER EVENT HANDLERS ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
    
    // Calculate cursor position relative to the image container
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMagnifierState({
      show: true,
      x,
      y,
      width,
      height
    });
  };

  const handleMouseLeave = () => {
    setMagnifierState((prev) => ({ ...prev, show: false }));
  };

  // Styles
  const fontHeading = { fontFamily: '"Rajdhani", sans-serif' };
  const fontBody = { fontFamily: '"Inter", sans-serif' };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#09090b]">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
      <h2 className="text-3xl font-bold mb-4" style={fontHeading}>Product Not Found</h2>
      <Link to="/products" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400"><ArrowLeft /> Back</Link>
    </div>
  );

  const features = product.features || ["High-grade steel construction", "Precision engineered threads", "Corrosion resistant coating"];
  const applications = product.applications || ["General Construction", "Furniture Hardware"];
  const currentImage = displayImages[selectedImageIndex];

  return (
    <div className="bg-zinc-950 min-h-screen text-gray-300 pb-24" style={fontBody}>
      
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3">
            <Link to="/products" className="hover:text-yellow-500 transition-colors">Catalog</Link>
            <ChevronRight size={10} className="mx-2" />
            <span className="text-zinc-300">{product.category || "Fasteners"}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase mb-2 leading-none" style={fontHeading}>
                {product.name}
              </h1>
              <p className="text-zinc-400 text-base md:text-lg max-w-2xl font-light leading-relaxed">
                {product.short_description}
              </p>
            </div>
            <div className="flex gap-3 text-zinc-500">
               <button className="hover:text-white transition-colors p-2.5 hover:bg-zinc-800 rounded border border-transparent hover:border-zinc-700"><Share2 size={18} /></button>
               <button onClick={() => window.print()} className="hover:text-white transition-colors p-2.5 hover:bg-zinc-800 rounded border border-transparent hover:border-zinc-700"><Printer size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: GALLERY WITH MAGNIFYING GLASS */}
          <div className="lg:col-span-5">
              
              <div className="flex gap-4 h-[500px]">
                {/* Thumbnails */}
                <div className="flex flex-col gap-3 w-16 overflow-y-auto no-scrollbar py-1">
                  {displayImages.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`
                        w-14 h-14 rounded-md border-2 bg-white overflow-hidden p-1 transition-all
                        ${selectedImageIndex === idx 
                          ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                          : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'}
                      `}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>

                {/* --- MAIN IMAGE STAGE --- */}
                <div 
                  className="flex-1 relative bg-white rounded-xl shadow-2xl border border-zinc-800 cursor-crosshair overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none" style={fontHeading}>
                        Pro Series
                    </div>

                    {/* The Base Image */}
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-white to-gray-50">
                        <img 
                          src={currentImage} 
                          alt={product.name} 
                          className="max-w-full max-h-full w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {/* --- THE MAGNIFYING GLASS (BILORY) --- */}
                    {magnifierState.show && (
                      <div 
                        style={{
                          position: 'absolute',
                          // Center the glass on the cursor
                          left: `${magnifierState.x - MAGNIFIER_SIZE / 2}px`,
                          top: `${magnifierState.y - MAGNIFIER_SIZE / 2}px`,
                          width: `${MAGNIFIER_SIZE}px`,
                          height: `${MAGNIFIER_SIZE}px`,
                          
                          // Circular Glass look
                          borderRadius: '50%', 
                          border: '2px solid #eab308', // Yellow border
                          boxShadow: '0 5px 15px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.5)', 
                          backgroundColor: 'white',
                          
                          // The Zoomed Image Logic
                          backgroundImage: `url("${currentImage}")`, // Added quotes for safety
                          backgroundRepeat: 'no-repeat',
                          
                          // Zoom the background size relative to the CONTAINER size (not the image natural size)
                          backgroundSize: `${magnifierState.width * ZOOM_LEVEL}px ${magnifierState.height * ZOOM_LEVEL}px`,
                          
                          // Move the background opposite to mouse movement to create "lens" effect
                          backgroundPositionX: `${-magnifierState.x * ZOOM_LEVEL + MAGNIFIER_SIZE / 2}px`,
                          backgroundPositionY: `${-magnifierState.y * ZOOM_LEVEL + MAGNIFIER_SIZE / 2}px`,
                          
                          pointerEvents: 'none', // Allow clicks to pass through
                          zIndex: 30
                        }}
                      />
                    )}

                    {/* Overlay Badges (Non-Clickable Indicators) */}
                    <div className={`absolute bottom-6 right-6 flex gap-3 z-20 transition-opacity duration-300 ${magnifierState.show ? 'opacity-0' : 'opacity-100'}`}>
                      <div className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                        <ZoomIn size={14} /> Hover to Zoom
                      </div>
                      <div className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg border border-gray-100">
                        <Rotate3D size={14} /> 360° View
                      </div>
                    </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-8 bg-zinc-900/30 border border-zinc-800/50 p-6 rounded">
                 <h4 className="flex items-center gap-2 text-[11px] font-bold text-yellow-500 uppercase tracking-[0.2em] mb-5">
                   <Box size={14} /> Engineering Highlights
                 </h4>
                 <ul className="space-y-4">
                    {features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-zinc-300 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shrink-0"></div>
                        {feat}
                      </li>
                    ))}
                 </ul>
              </div>
          </div>

          {/* RIGHT: Technical Details */}
          <div className="lg:col-span-7">
            <div className="space-y-10">
              {/* Specs Header */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3 uppercase" style={fontHeading}>
                   Specifications
                   <div className="h-px flex-grow bg-zinc-800"></div>
                </h3>
                
                <div className="border-t border-zinc-800">
                  {/* Material */}
                  <div className="grid grid-cols-[140px_1fr] py-4 border-b border-zinc-800 items-center">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] pl-2">Material</span>
                    <span className="text-white text-lg font-medium" style={fontHeading}>{product.material || "Hardened Steel"}</span>
                  </div>

                  {/* Head Type */}
                  <div className="grid grid-cols-[140px_1fr] py-4 border-b border-zinc-800 items-center">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] pl-2">Head Type</span>
                    <span className="text-white text-lg font-medium" style={fontHeading}>{product.head_type || "N/A"}</span>
                  </div>

                  {/* Diameter */}
                  <div className="grid grid-cols-[140px_1fr] py-4 border-b border-zinc-800 items-center bg-zinc-900/20">
                    <label className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.15em] pl-2 flex items-center gap-2">
                        <Settings size={12} /> Diameter
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedDia}
                            onChange={(e) => setSelectedDia(e.target.value)}
                            className="w-full md:w-64 bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-2 appearance-none focus:border-yellow-500 focus:outline-none cursor-pointer"
                            style={fontHeading}
                        >
                            <option value="" disabled>Select Diameter</option>
                            {uniqueDiameters.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 md:right-[calc(100%-15rem)] top-3 pointer-events-none text-zinc-500 rotate-90" size={16} />
                    </div>
                  </div>

                  {/* Length */}
                  <div className="grid grid-cols-[140px_1fr] py-6 border-b border-zinc-800 items-start">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] pl-2 mt-2">Length</span>
                    <div className="flex flex-wrap gap-2">
                        {availableLengths.length > 0 ? availableLengths.map(len => (
                            <button
                                key={len}
                                onClick={() => setSelectedLen(len)}
                                className={`min-w-[60px] px-3 py-2 text-sm font-bold border transition-all ${
                                    selectedLen === len 
                                    ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                                }`}
                                style={fontHeading}
                            >
                                {len}
                            </button>
                        )) : (
                            <span className="text-zinc-600 italic text-sm py-2">Select a Diameter first</span>
                        )}
                    </div>
                  </div>

                  {/* Finishes */}
                  <div className="grid grid-cols-[140px_1fr] py-6 items-start">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] pl-2 mt-3">Available Finishes</span>
                    <div className="flex flex-wrap gap-2">
                      {availableFinishes.length > 0 ? availableFinishes.map((finish: any) => (
                        <button
                            key={finish}
                            onClick={() => handleFinishClick(finish)}
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide border border-zinc-700 text-zinc-300 hover:border-yellow-500 hover:text-yellow-500 transition-all duration-200"
                            style={fontHeading}
                        >
                            {finish}
                        </button>
                      )) : (
                        <span className="text-zinc-600 italic text-sm py-2">
                            {selectedDia && selectedLen ? "No specific finish listed" : "Select Size options first"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3 uppercase" style={fontHeading}>
                   Applications
                   <div className="h-px flex-grow bg-zinc-800"></div>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {applications.map((app: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors">
                      <div className="w-6 h-6 flex items-center justify-center bg-zinc-800 text-yellow-500">
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="text-zinc-300 text-sm font-medium tracking-wide">{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 flex flex-col sm:flex-row gap-5">
                <Link to="/contact" className="flex-1 bg-yellow-500 text-black text-center text-sm font-bold uppercase tracking-widest py-4 px-6 hover:bg-yellow-400 transition-all flex items-center justify-center gap-3" style={fontHeading}>
                  <ShoppingCart size={18} /> Request Quote
                </Link>
                <button className="flex-1 bg-transparent text-white border border-zinc-700 text-sm font-bold uppercase tracking-widest py-4 px-6 hover:bg-zinc-800 hover:border-zinc-500 transition-all flex items-center justify-center gap-3" style={fontHeading}>
                  <FileText size={18} /> Download Specs
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;