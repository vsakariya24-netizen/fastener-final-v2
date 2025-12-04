import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft, Save, Loader2, Trash2, Upload,
  X, Check, Ruler, Palette, Image as ImageIcon,
  Plus, LayoutGrid
} from 'lucide-react';

// Define types
type CategoryStructure = {
  id: string;
  name: string;
  sub_categories: { id: string; name: string }[];
};

const AddProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Categories State
  const [categories, setCategories] = useState<CategoryStructure[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '', 
    sub_category: '',
    material: '',
    head_type: '',
    thread_type: '',
    short_description: '',
    long_description: '',
    images: [] as string[],
    specifications: [] as { key: string; value: string }[],
    // REMOVED features (Highlights)
    applications: [] as string[] // REVERTED to simple string array (No Images)
  });

  const [sizes, setSizes] = useState<Array<{ diameter: string, length: string }>>([
    { diameter: '', length: '' }
  ]);

  const [finishes, setFinishes] = useState<Array<{ name: string, image: string, loading: boolean }>>([
    { name: '', image: '', loading: false }
  ]);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('*');
        const { data: subs } = await supabase.from('sub_categories').select('*');
        
        if (cats && subs) {
            const structuredData = cats.map(cat => ({
            id: cat.id,
            name: cat.name,
            sub_categories: subs.filter(sub => sub.category_id === cat.id)
            }));
            setCategories(structuredData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Product Data
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
        
        if (product) {
          // Handle Applications: Check if it's old string array or new object array and convert to string
          let loadedApps: string[] = [];
          if (Array.isArray(product.applications)) {
             loadedApps = product.applications.map((app: any) => typeof app === 'string' ? app : app.name);
          }

          setFormData({
            name: product.name,
            slug: product.slug,
            category: product.category,
            sub_category: product.sub_category || '',
            material: product.material || '',
            head_type: product.head_type || '',
            thread_type: product.thread_type || '',
            short_description: product.short_description || '',
            long_description: product.long_description || '',
            images: product.images || [],
            specifications: Array.isArray(product.specifications) ? product.specifications : [],
            applications: loadedApps 
          });

          // Variants Logic
          const { data: variantData } = await supabase.from('product_variants').select('*').eq('product_id', id);
          if (variantData && variantData.length > 0) {
            // Reconstruct Sizes
            const uniqueSizes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(s => s.diameter === curr.diameter && s.length === curr.length);
                if (!exists && (curr.diameter || curr.length)) acc.push({ diameter: curr.diameter, length: curr.length });
                return acc;
            }, []);
            setSizes(uniqueSizes.length ? uniqueSizes : [{ diameter: '', length: '' }]);

            // Reconstruct Finishes
            const uniqueFinishes = variantData.reduce((acc: any[], curr) => {
                const exists = acc.find(f => f.name === curr.finish);
                if (!exists && curr.finish) {
                    const img = product.finish_images ? product.finish_images[curr.finish] : '';
                    acc.push({ name: curr.finish, image: img, loading: false });
                }
                return acc;
            }, []);
            setFinishes(uniqueFinishes.length ? uniqueFinishes : [{ name: '', image: '', loading: false }]);
          }
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Application Handlers (Text Only Now)
  const addApp = () => setFormData(p => ({ ...p, applications: [...p.applications, ''] }));
  
  const updateApp = (idx: number, val: string) => {
    const newApps = [...formData.applications];
    newApps[idx] = val;
    setFormData(p => ({ ...p, applications: newApps }));
  };
  
  const removeApp = (idx: number) => {
    setFormData(p => ({ ...p, applications: p.applications.filter((_, i) => i !== idx) }));
  };

  // Standard Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `gallery/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, images: [publicUrl, ...prev.images] }));
    }
    setUploading(false);
  };

  // Size & Finish Handlers
  const addSizeRow = () => setSizes([...sizes, { diameter: '', length: '' }]);
  const removeSizeRow = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));
  const handleSizeChange = (idx: number, field: 'diameter'|'length', val: string) => {
    const newSizes = [...sizes];
    newSizes[idx][field] = val;
    setSizes(newSizes);
  };

  const addFinishRow = () => setFinishes([...finishes, { name: '', image: '', loading: false }]);
  const removeFinishRow = (idx: number) => setFinishes(finishes.filter((_, i) => i !== idx));
  const handleFinishNameChange = (idx: number, val: string) => {
    const newF = [...finishes];
    newF[idx].name = val;
    setFinishes(newF);
  };
  const handleFinishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (!e.target.files || !e.target.files[0]) return;
    const newF = [...finishes];
    newF[idx].loading = true;
    setFinishes(newF);
    
    const file = e.target.files[0];
    const fileName = `finishes/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        const updated = [...finishes];
        updated[idx].image = publicUrl;
        updated[idx].loading = false;
        setFinishes(updated);
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finishImageMap: Record<string, string> = {};
    finishes.forEach(f => { if(f.name && f.image) finishImageMap[f.name] = f.image; });

    const payload = {
      ...formData,
      slug: finalSlug,
      finish_images: finishImageMap,
      // Removed features
      applications: formData.applications.filter(a => a.trim() !== ''),
    };

    try {
      let productId = id;
      if (isEditMode) {
        await supabase.from('products').update(payload).eq('id', id);
      } else {
        const { data, error } = await supabase.from('products').insert([payload]).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Handle Variants (Delete all & Re-insert)
      if (productId) {
        await supabase.from('product_variants').delete().eq('product_id', productId);
        
        const validSizes = sizes.filter(s => s.diameter || s.length);
        const validFinishes = finishes.filter(f => f.name);
        const variantsToInsert: any[] = [];

        if (validSizes.length > 0) {
           validSizes.forEach(size => {
              if (validFinishes.length > 0) {
                 validFinishes.forEach(finish => {
                    variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: finish.name });
                 });
              } else {
                 variantsToInsert.push({ product_id: productId, diameter: size.diameter, length: size.length, finish: '' });
              }
           });
        } else if (validFinishes.length > 0) {
           validFinishes.forEach(finish => variantsToInsert.push({ product_id: productId, diameter: '', length: '', finish: finish.name }));
        }

        if (variantsToInsert.length > 0) await supabase.from('product_variants').insert(variantsToInsert);
      }

      navigate('/admin/products');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const activeSubCategories = categories.find(c => c.name === formData.category)?.sub_categories || [];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Category & Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Check size={18} className="text-brand-blue" /> Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
             <div>
                <label className="block text-sm font-bold mb-1">Product Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-bold mb-1">Main Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Sub Category</label>
                    <select name="sub_category" value={formData.sub_category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select...</option>
                        {activeSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
             <input name="material" value={formData.material} onChange={handleChange} placeholder="Material (e.g. MS 1022)" className="px-4 py-2 border rounded-lg" />
             <input name="head_type" value={formData.head_type} onChange={handleChange} placeholder="Head Type" className="px-4 py-2 border rounded-lg" />
             <input name="thread_type" value={formData.thread_type} onChange={handleChange} placeholder="Thread Type" className="px-4 py-2 border rounded-lg" />
          </div>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Short Description" className="w-full px-4 py-2 border rounded-lg mb-4" rows={2} />
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} placeholder="Long Description" className="w-full px-4 py-2 border rounded-lg" rows={4} />
        </div>

        {/* 2. Applications (TEXT ONLY) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
           <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><LayoutGrid size={18} /> Applications</h3>
              <button type="button" onClick={addApp} className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1 rounded hover:bg-green-200">+ Add Application</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.applications.map((app, idx) => (
                 <div key={idx} className="flex items-center gap-2">
                    <input value={app} onChange={(e) => updateApp(idx, e.target.value)} placeholder="Application (e.g. Furniture)" className="flex-1 px-3 py-2 border rounded-lg" />
                    <button type="button" onClick={() => removeApp(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                 </div>
              ))}
           </div>
           {formData.applications.length === 0 && <p className="text-gray-400 text-sm italic">No applications added.</p>}
        </div>

        {/* 3. Sizes & Finishes (Existing Logic) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Dimensions</h3><button type="button" onClick={addSizeRow} className="text-blue-600 text-sm font-bold">+ Add Size</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {sizes.map((s, idx) => (
                        <div key={idx} className="flex gap-2"><input value={s.diameter} onChange={e=>handleSizeChange(idx,'diameter',e.target.value)} placeholder="Dia" className="w-20 px-2 py-1 border rounded" /><input value={s.length} onChange={e=>handleSizeChange(idx,'length',e.target.value)} placeholder="Len" className="flex-1 px-2 py-1 border rounded" /><button type="button" onClick={()=>removeSizeRow(idx)}><Trash2 size={16} className="text-red-400"/></button></div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Finishes</h3><button type="button" onClick={addFinishRow} className="text-purple-600 text-sm font-bold">+ Add Finish</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {finishes.map((f, idx) => (
                        <div key={idx} className="flex items-center gap-2 border p-2 rounded">
                            <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden relative"><img src={f.image} className="w-full h-full object-cover"/><input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e=>handleFinishImageUpload(e, idx)}/></div>
                            <input value={f.name} onChange={e=>handleFinishNameChange(idx,e.target.value)} placeholder="Finish" className="flex-1 px-2 py-1 border rounded" />
                            <button type="button" onClick={()=>removeFinishRow(idx)}><Trash2 size={16} className="text-red-400"/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. Standard Gallery */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-4">Product Gallery</h3>
            <div className="flex flex-wrap gap-4">
                {formData.images.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 border rounded overflow-hidden relative group">
                        <img src={img} className="w-full h-full object-cover"/>
                        <button type="button" onClick={()=>setFormData(p=>({...p, images: p.images.filter((_, i)=>i!==idx)}))} className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={12}/></button>
                    </div>
                ))}
                <label className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload className="text-gray-400"/>}
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input type="file" className="hidden" onChange={handleImageUpload}/>
                </label>
            </div>
        </div>

        <div className="flex justify-end pb-10">
            <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <Save size={20}/>} {isEditMode ? 'Update Product' : 'Save Product'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;