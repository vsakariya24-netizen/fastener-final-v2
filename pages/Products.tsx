import React, { useState, useMemo, useEffect } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import { supabase } from '../lib/supabase';

import { Product } from '../types';

import {

  Search, ChevronDown, ChevronRight, Filter,

  ArrowRight, X, Loader2, CornerDownRight,

  LayoutGrid, SlidersHorizontal

} from 'lucide-react';

import { PRODUCTS as STATIC_PRODUCTS } from '../constants';



// --- 1. CATALOGUE STRUCTURE (Preserved your logic) ---

const CATALOGUE_STRUCTURE = [

  {

    id: 'fasteners',

    name: 'FASTENERS SEGMENT',

    dbCategoryName: 'Fasteners Segment',

    subCategories: [

      { name: 'POP Drywall (Gypsum) Screw', id: 'drywall' },

      { name: 'S.S. Self Tapping Screw', id: 'ss-tapping' },

      { name: 'M.S. Sheet Metal Self Tapping', id: 'ms-tapping' },

      { name: 'Chipboard Screw', id: 'chipboard' },

      {

        name: 'Self Drilling Screw (SDS)',

        id: 'sds',

        types: [

          { name: 'CSK Head SDS', id: 'sds-csk' },

          { name: 'Pan Head SDS', id: 'sds-pan' },

          { name: 'Truss Head SDS', id: 'sds-truss' },

          { name: 'Hex Head SDS', id: 'sds-hex' }

        ]

      },

      { name: 'Machine Screw', id: 'machine' },

      { name: 'Nylon Frame Fixing Anchors', id: 'anchors' }

    ]

  },

  {

    id: 'fittings',

    name: 'DOOR & FURNITURE FITTING',

    dbCategoryName: 'Door & Furniture Fittings',

    subCategories: [

      { name: 'Door Magnet', id: 'magnet' },

      { name: 'Buffers', id: 'buffers' },

      { name: 'Door Silencers', id: 'silencers' },

      { name: 'Caster Wheels', id: 'caster' },

      { name: 'Auto Hinges', id: 'hinges' },

      { name: 'Wall Grip', id: 'wall-grip' },

      { name: 'Wire Nails', id: 'nails' }

    ]

  }

];



const Products: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initialCat);

  const [expandedCats, setExpandedCats] = useState<string[]>(['fasteners', 'fittings', 'sds']);

  const [searchTerm, setSearchTerm] = useState('');

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;



  // --- DATA FETCHING ---

  useEffect(() => {

    const fetchProducts = async () => {

      setLoading(true);

      const { data, error } = await supabase.from('products').select('*');

      if (!error && data && data.length > 0) {

        setProducts(data);

      } else {

        setProducts(STATIC_PRODUCTS as unknown as Product[]);

      }

      setLoading(false);

    };

    fetchProducts();

  }, []);



  // --- SYNC URL ---

  useEffect(() => {

    if (activeCategory === 'All') {

      searchParams.delete('category');

    } else {

      searchParams.set('category', activeCategory);

    }

    setSearchParams(searchParams);

    setCurrentPage(1);

  }, [activeCategory, setSearchParams, searchParams]);



  const toggleCategory = (id: string) => {

    setExpandedCats(prev =>

      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]

    );

  };



  // --- FILTERING LOGIC ---

  const filteredProducts = useMemo(() => {

    return products.filter(p => {

      let categoryMatch = true;



      if (activeCategory !== 'All') {

        const mainCat = CATALOGUE_STRUCTURE.find(c => c.id === activeCategory);

       

        if (mainCat) {

           categoryMatch = p.category === mainCat.dbCategoryName;

        } else {

           const findSubCat = (id: string) => {

             for (const cat of CATALOGUE_STRUCTURE) {

               for (const sub of cat.subCategories) {

                 if (sub.id === id) return sub;

                 if (sub.types && sub.types.some(t => t.id === id)) return { ...sub, specificType: id };

               }

             }

             return null;

           };



           const targetSub = findSubCat(activeCategory);

           

           if (targetSub) {

             if (p.sub_category === activeCategory) {

                 categoryMatch = true;

             } else {

                 categoryMatch = p.slug?.toLowerCase().includes(activeCategory) ||

                                 p.sub_category?.toLowerCase().includes(activeCategory);

             }

           } else {

              categoryMatch = p.category === activeCategory || p.sub_category === activeCategory;

           }

        }

      }



      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;

    });

  }, [products, activeCategory, searchTerm]);



  const paginatedProducts = filteredProducts.slice(

    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage

  );



  return (

    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

     

      {/* =========================================

          1. MODERN HEADER SECTION

      ========================================= */}

      <div className="bg-[#1a1a1a] text-white py-16 relative overflow-hidden">

        {/* Subtle Pattern Overlay */}

        <div className="absolute inset-0 opacity-10"

             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>

        </div>

       

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">

            Our Products

          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-lg">

            Precision engineered hardware for the world's most demanding industries.

          </p>

         

          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 text-sm font-medium">

            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>

            <ChevronRight size={14} className="mx-2 text-gray-600" />

            <span className="text-yellow-400">Catalogue</span>

          </div>

        </div>

      </div>



      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col lg:flex-row gap-10">

         

          {/* =========================================

              2. PROFESSIONAL SIDEBAR

          ========================================= */}

          <aside className="w-full lg:w-[280px] flex-shrink-0">

            <div className="sticky top-24 space-y-6">

             

              {/* Search Box - Modern Input */}

              <div className="relative group">

                <input

                  type="text"

                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-transparent shadow-sm rounded-xl text-sm font-medium transition-all duration-300

                             focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:shadow-md group-hover:border-gray-200"

                  placeholder="Search parts..."

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)}

                />

                <Search className="absolute left-4 top-3.5 text-gray-400 transition-colors group-hover:text-yellow-500" size={20} />

                {searchTerm && (

                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500 transition-colors">

                    <X size={18} />

                  </button>

                )}

              </div>



              {/* Filter Panel */}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">

                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><SlidersHorizontal size={18} className="text-yellow-500" /> Filters</h3>

                  {activeCategory !== 'All' && (

                    <button onClick={() => setActiveCategory('All')} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wide transition-colors">Clear</button>

                  )}

                </div>



                <div className="p-2 space-y-1">

                  <button

                    onClick={() => setActiveCategory('All')}

                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-3

                    ${activeCategory === 'All'

                        ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]'

                        : 'text-gray-600 hover:bg-gray-50'}`}

                  >

                    <LayoutGrid size={16} /> View All

                  </button>



                  {CATALOGUE_STRUCTURE.map((cat) => (

                    <div key={cat.id} className="pt-2">

                      {/* Main Category Header */}

                      <div className="px-2 mb-1">

                          <button

                            className="flex items-center justify-between w-full p-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"

                            onClick={() => toggleCategory(cat.id)}

                          >

                            {cat.name}

                            <ChevronDown size={14} className={`transform transition-transform duration-300 ${expandedCats.includes(cat.id) ? 'rotate-180 text-yellow-500' : ''}`} />

                          </button>

                      </div>



                      {/* Sub Categories Accordion */}

                      <div className={`space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${expandedCats.includes(cat.id) ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>

                           {cat.subCategories.map((sub, idx) => {

                             const isSDS = sub.id === 'sds';

                             const isSDSExpanded = expandedCats.includes('sds');

                             const isActive = activeCategory === sub.id;



                             return (

                               <div key={idx}>

                                 <button

                                   onClick={() => {

                                     setActiveCategory(sub.id);

                                     if(isSDS) toggleCategory('sds');

                                   }}

                                   className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all duration-200 flex items-center justify-between group

                                     ${isActive

                                       ? 'bg-yellow-50 text-gray-900 font-bold border-l-4 border-yellow-400'

                                       : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:pl-5'}`}

                                 >

                                     <span className="flex-1 truncate">{sub.name}</span>

                                     {isSDS && <ChevronRight size={14} className={`text-gray-400 transition-transform ${isSDSExpanded ? 'rotate-90' : ''}`} />}

                                 </button>



                                 {/* SDS Nested Types */}

                                 {isSDS && sub.types && (

                                   <div className={`ml-4 pl-3 border-l border-gray-200 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isSDSExpanded ? 'max-h-40 opacity-100 py-1' : 'max-h-0 opacity-0'}`}>

                                      {sub.types.map((type) => (

                                        <button

                                          key={type.id}

                                          onClick={() => setActiveCategory(type.id)}

                                          className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-2

                                            ${activeCategory === type.id

                                              ? 'text-yellow-600 font-bold bg-yellow-50/50'

                                              : 'text-gray-500 hover:text-gray-900'}`}

                                        >

                                          <CornerDownRight size={10} className={activeCategory === type.id ? 'text-yellow-500' : 'opacity-30'} />

                                          {type.name}

                                        </button>

                                      ))}

                                   </div>

                                 )}

                               </div>

                             );

                           })}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </aside>



          {/* =========================================

              3. PRODUCT GRID

          ========================================= */}

          <div className="flex-1">

            <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4">

               <div>

                  <h2 className="text-3xl font-bold text-gray-900">

                    {activeCategory === 'All' ? 'Complete Catalogue' : 'Filtered Selection'}

                  </h2>

                  <p className="text-gray-500 mt-1 text-sm">Showing the highest quality industrial hardware.</p>

               </div>

               <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">

                  {filteredProducts.length} Items Found

               </span>

            </div>



            {loading ? (

               <div className="flex flex-col items-center justify-center py-32 text-gray-400">

                 <Loader2 size={48} className="animate-spin text-yellow-400 mb-4" />

                 <p className="text-sm font-medium animate-pulse">Loading precision parts...</p>

               </div>

            ) : paginatedProducts.length > 0 ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {paginatedProducts.map((product) => (

                  <Link

                    key={product.id}

                    to={`/product/${product.slug}`}

                    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col

                               hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-yellow-400/50 transition-all duration-500"

                  >

                    {/* Badge */}

                    <div className="absolute top-4 left-4 z-10">

                       <span className="px-2.5 py-1 rounded-md bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">

                          {product.category === 'Fasteners Segment' ? 'Fastener' : 'Fitting'}

                       </span>

                    </div>



                    {/* Image Area - UPDATED FOR FULL SCREW VIEW */}

                    <div className="relative w-full aspect-square bg-white p-4 flex items-center justify-center overflow-hidden">

                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 to-white opacity-50"></div>

                       

                       {product.images?.[0] ? (

                         <img

                           src={product.images[0]}

                           alt={product.name}

                           className="relative z-10 w-full h-full object-contain drop-shadow-lg transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"

                         />

                       ) : (

                         <div className="text-gray-300 text-xs">No Image</div>

                       )}



                       {/* Hover Overlay Button */}

                       <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">

                          <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors">

                            View Details <ArrowRight size={16} />

                          </button>

                       </div>

                    </div>

                   

                    {/* Content Area */}

                    <div className="p-6 pt-4 flex-grow flex flex-col border-t border-gray-50">

                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-yellow-600 transition-colors">

                        {product.name}

                      </h3>

                      <div className="mt-auto pt-3 flex items-center justify-between text-xs font-medium text-gray-400 border-t border-gray-100 border-dashed">

                          <span>In Stock</span>

                          <span className="group-hover:translate-x-1 transition-transform duration-300">{product.id.toString().slice(0,0)}</span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            ) : (

              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 text-center">

                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">

                   <Filter size={40} />

                 </div>

                 <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>

                 <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any products in the <span className="font-bold text-gray-800">"{activeCategory}"</span> category matching your search.</p>

                 <button

                   onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}

                   className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all"

                 >

                   Clear All Filters

                 </button>

              </div>

            )}

           

            {/* Pagination Placeholder (Visual Only) */}

            {paginatedProducts.length > 0 && (

               <div className="mt-12 flex justify-center gap-2">

                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c-1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"><ChevronDown className="rotate-90" size={20}/></button>

                  <span className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold">{currentPage}</span>

                  <button className="p-2 rounded-lg border hover:bg-gray-50"><ChevronDown className="-rotate-90" size={20}/></button>

               </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};



export default Products;