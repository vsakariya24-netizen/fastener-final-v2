import React, { useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { supabase } from '../../lib/supabase';

import {

  ArrowLeft, Save, Loader2, Trash2, Upload,

  X, Check, Ruler, Palette, Image as ImageIcon,

  Plus

} from 'lucide-react';



// Define types for our dynamic categories

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

 

  // --- DYNAMIC CATEGORY STATE ---

  const [categories, setCategories] = useState<CategoryStructure[]>([]);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);



  // Form Data

  const [formData, setFormData] = useState({

    name: '',

    slug: '',

    category: '', // Removed hardcoded default

    sub_category: '',

    material: '',

    head_type: '',

    thread_type: '',

    short_description: '',

    long_description: '',

    images: [] as string[],

    specifications: [] as { key: string; value: string }[],

    features: [] as string[],

    applications: [] as string[]

  });



  const [sizes, setSizes] = useState<Array<{ diameter: string, length: string }>>([

    { diameter: '', length: '' }

  ]);



  const [finishes, setFinishes] = useState<Array<{ name: string, image: string, loading: boolean }>>([

    { name: '', image: '', loading: false }

  ]);



  // 1. Fetch Categories from DB

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        // Fetch categories

        const { data: cats, error: catError } = await supabase.from('categories').select('*');

        if (catError) throw catError;



        // Fetch sub-categories

        const { data: subs, error: subError } = await supabase.from('sub_categories').select('*');

        if (subError) throw subError;



        // Combine them

        const structuredData = cats.map(cat => ({

          id: cat.id,

          name: cat.name,

          sub_categories: subs.filter(sub => sub.category_id === cat.id)

        }));



        setCategories(structuredData);

       

        // Set default category if not editing and categories exist

        if (!isEditMode && structuredData.length > 0) {

           setFormData(prev => ({...prev, category: structuredData[0].name}));

        }

      } catch (error) {

        console.error("Error fetching categories:", error);

      } finally {

        setIsCategoriesLoading(false);

      }

    };



    fetchCategories();

  }, [isEditMode]);



  // 2. Fetch Product Data for Edit

  useEffect(() => {

    if (isEditMode) {

      const fetchProduct = async () => {

        const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

       

        if (product) {

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

            features: Array.isArray(product.features) ? product.features : [],

            applications: Array.isArray(product.applications) ? product.applications : []

          });



          // Fetch Variants logic...

          const { data: variantData } = await supabase

            .from('product_variants')

            .select('*')

            .eq('product_id', id);

           

          if (variantData && variantData.length > 0) {

            const uniqueSizes = variantData.reduce((acc: any[], curr) => {

                const exists = acc.find(s => s.diameter === curr.diameter && s.length === curr.length);

                if (!exists && (curr.diameter || curr.length)) {

                    acc.push({ diameter: curr.diameter, length: curr.length });

                }

                return acc;

            }, []);

            setSizes(uniqueSizes.length ? uniqueSizes : [{ diameter: '', length: '' }]);



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



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    const { name, value } = e.target;

    setFormData(prev => {

      const newData = { ...prev, [name]: value };

     

      // If Category changes, reset sub-category

      if (name === 'category') {

          newData.sub_category = '';

      }



      if (!isEditMode && name === 'name') {

        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      }

      return newData;

    });

  };



  // --- SIZE HANDLERS ---

  const addSizeRow = () => setSizes([...sizes, { diameter: '', length: '' }]);

  const removeSizeRow = (idx: number) => setSizes(sizes.filter((_, i) => i !== idx));

  const handleSizeChange = (idx: number, field: 'diameter'|'length', val: string) => {

    const newSizes = [...sizes];

    newSizes[idx][field] = val;

    setSizes(newSizes);

  };



  // --- FINISH HANDLERS ---

  const addFinishRow = () => setFinishes([...finishes, { name: '', image: '', loading: false }]);

  const removeFinishRow = (idx: number) => setFinishes(finishes.filter((_, i) => i !== idx));

  const handleFinishNameChange = (idx: number, val: string) => {

    const newFinishes = [...finishes];

    newFinishes[idx].name = val;

    setFinishes(newFinishes);

  };



  const handleFinishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {

    if (!e.target.files || e.target.files.length === 0) return;

   

    const newFinishes = [...finishes];

    newFinishes[idx].loading = true;

    setFinishes(newFinishes);



    const file = e.target.files[0];

    const finishName = newFinishes[idx].name || 'unknown';

    const fileName = `finishes/${Date.now()}-${finishName}-${file.name.replace(/\s/g, '-')}`;



    const { error } = await supabase.storage.from('product-images').upload(fileName, file);

   

    if (!error) {

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      const updatedFinishes = [...finishes];

      updatedFinishes[idx].image = publicUrl;

      updatedFinishes[idx].loading = false;

      setFinishes(updatedFinishes);

    } else {

      alert('Upload failed: ' + error.message);

      const updatedFinishes = [...finishes];

      updatedFinishes[idx].loading = false;

      setFinishes(updatedFinishes);

    }

  };



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    const file = e.target.files[0];

    const fileName = `gallery/${Date.now()}-${file.name.replace(/\s/g, '-')}`;

   

    const { error } = await supabase.storage.from('product-images').upload(fileName, file);

    if (!error) {

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, images: [publicUrl, ...prev.images] }));

    } else {

      alert('Upload failed: ' + error.message);

    }

    setUploading(false);

  };





  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);



    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-');

    const finishImageMap: Record<string, string> = {};

    finishes.forEach(f => {

        if(f.name && f.image) finishImageMap[f.name] = f.image;

    });



    const productPayload = {

      ...formData,

      slug: finalSlug,

      finish_images: finishImageMap,

      specifications: formData.specifications.filter(s => s.key && s.value),

      features: formData.features.filter(f => f.trim() !== ''),

      applications: formData.applications.filter(a => a.trim() !== ''),

    };



    try {

      let productId = id;



      if (isEditMode) {

        const { error } = await supabase.from('products').update(productPayload).eq('id', id);

        if (error) throw error;

      } else {

        const { data, error } = await supabase.from('products').insert([productPayload]).select().single();

        if (error) throw error;

        productId = data.id;

      }



      if (productId) {

        await supabase.from('product_variants').delete().eq('product_id', productId);

       

        const validSizes = sizes.filter(s => s.diameter || s.length);

        const validFinishes = finishes.filter(f => f.name);

        const variantsToInsert: any[] = [];



        if (validSizes.length > 0) {

            validSizes.forEach(size => {

                if (validFinishes.length > 0) {

                    validFinishes.forEach(finish => {

                        variantsToInsert.push({

                            product_id: productId,

                            diameter: size.diameter,

                            length: size.length,

                            finish: finish.name

                        });

                    });

                } else {

                    variantsToInsert.push({

                        product_id: productId,

                        diameter: size.diameter,

                        length: size.length,

                        finish: ''

                    });

                }

            });

        } else if (validFinishes.length > 0) {

            validFinishes.forEach(finish => {

                variantsToInsert.push({

                    product_id: productId,

                    diameter: '',

                    length: '',

                    finish: finish.name

                });

            });

        }



        if (variantsToInsert.length > 0) {

            const { error: vError } = await supabase.from('product_variants').insert(variantsToInsert);

            if (vError) throw vError;

        }

      }

      navigate('/admin/products');

    } catch (error: any) {

      alert('Error: ' + error.message);

    } finally {

      setLoading(false);

    }

  };



  // --- DYNAMIC SUB CATEGORY LOOKUP ---

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

       

        {/* Category & Basic Info Sections */}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">

            <Check size={18} className="text-brand-blue" /> Categorization

          </h3>

         

          {isCategoriesLoading ? (

            <div className="flex items-center gap-2 text-gray-500 py-4">

                <Loader2 className="animate-spin" size={20}/> Loading Categories...

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                <label className="block text-sm font-bold text-gray-700 mb-2">Main Segment</label>

                <select

                    name="category"

                    value={formData.category}

                    onChange={handleChange}

                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"

                >

                    <option value="" disabled>-- Select Main Segment --</option>

                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}

                </select>

                </div>

                <div>

                <label className="block text-sm font-bold text-gray-700 mb-2">Sub-Category</label>

                <select

                    name="sub_category"

                    value={formData.sub_category}

                    onChange={handleChange}

                    required

                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${!formData.sub_category ? 'bg-yellow-50 border-brand-yellow' : 'bg-white'}`}

                >

                    <option value="">-- Select Sub Category --</option>

                    {activeSubCategories.map(sub => (

                    // We use ID for value here, but display name. Ensure your DB products table stores this correctly.

                    // If you want to store ID in product table, that is fine.

                    // If your current data uses Names for IDs, you might want to use sub.id or sub.name depending on your setup.

                    // Assuming we stick to ID for uniqueness:

                    <option key={sub.id} value={sub.id}>{sub.name}</option>

                    ))}

                </select>

                </div>

            </div>

          )}

        </div>



        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

          <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

             <div>

               <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>

               <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" />

             </div>

             <div>

               <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>

               <input name="material" value={formData.material} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Mild Steel" />

             </div>

             <div>

               <label className="block text-sm font-medium text-gray-700 mb-1">Head Type</label>

               <input name="head_type" value={formData.head_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-yellow-50 border-yellow-200" placeholder="e.g. CSK PHILLIPS (+)" />

             </div>

             <div>

               <label className="block text-sm font-medium text-gray-700 mb-1">Thread Type (Optional)</label>

               <input name="thread_type" value={formData.thread_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Fine Thread" />

             </div>

          </div>

          <div className="mb-4">

             <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>

             <textarea name="short_description" rows={2} value={formData.short_description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />

          </div>

          <div>

             <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>

             <textarea name="long_description" rows={4} value={formData.long_description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />

          </div>

        </div>

       

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. DIMENSIONS SECTION */}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full border-l-4 border-l-blue-500">

                <div className="flex justify-between items-center mb-4 border-b pb-2">

                    <div>

                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Ruler size={18} /> Dimensions (Matrix)</h3>

                        <p className="text-[10px] text-gray-500">Add available sizes. Each size will apply to ALL finishes.</p>

                    </div>

                    <button type="button" onClick={addSizeRow} className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded hover:bg-blue-200 flex items-center gap-1">

                        <Plus size={14}/> Add Size

                    </button>

                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">

                    {sizes.map((s, idx) => (

                    <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded">

                        <input

                            placeholder="Diameter (e.g. M6)"

                            value={s.diameter}

                            onChange={e => handleSizeChange(idx, 'diameter', e.target.value)}

                            className="w-1/2 px-3 py-2 border rounded text-sm"

                        />

                        <input

                            placeholder="Length (e.g. 25mm)"

                            value={s.length}

                            onChange={e => handleSizeChange(idx, 'length', e.target.value)}

                            className="w-1/2 px-3 py-2 border rounded text-sm"

                        />

                        <button type="button" onClick={() => removeSizeRow(idx)} className="text-red-400 hover:text-red-600 p-2">

                            <Trash2 size={16} />

                        </button>

                    </div>

                    ))}

                    {sizes.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No sizes added.</p>}

                </div>

            </div>



            {/* 2. FINISHES SECTION */}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full border-l-4 border-l-purple-500">

                <div className="flex justify-between items-center mb-4 border-b pb-2">

                    <div>

                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Palette size={18} /> Finishes & Images</h3>

                        <p className="text-[10px] text-gray-500">Add finishes. Images uploaded here will be used for color swapping.</p>

                    </div>

                    <button type="button" onClick={addFinishRow} className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-2 rounded hover:bg-purple-200 flex items-center gap-1">

                        <Plus size={14}/> Add Finish

                    </button>

                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">

                    {finishes.map((f, idx) => (

                    <div key={idx} className="flex flex-col gap-2 bg-gray-50 p-3 rounded border border-gray-100">

                        <div className="flex gap-2 items-center">

                            <input

                                placeholder="Finish Name (e.g. Zinc)"

                                value={f.name}

                                onChange={e => handleFinishNameChange(idx, e.target.value)}

                                className="flex-1 px-3 py-2 border rounded text-sm font-bold"

                            />

                            <button type="button" onClick={() => removeFinishRow(idx)} className="text-red-400 hover:text-red-600 p-2">

                                <Trash2 size={16} />

                            </button>

                        </div>

                        <div className="flex items-center gap-3 mt-1">

                            {f.image ? (

                                <div className="relative w-12 h-12 border rounded bg-white">

                                    <img src={f.image} alt="finish" className="w-full h-full object-cover rounded" />

                                    <button type="button" onClick={() => {

                                        const newF = [...finishes];

                                        newF[idx].image = '';

                                        setFinishes(newF);

                                    }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">

                                        <X size={10} />

                                    </button>

                                </div>

                            ) : (

                                <div className="w-12 h-12 border border-dashed rounded bg-white flex items-center justify-center text-gray-300">

                                    <ImageIcon size={20} />

                                </div>

                            )}

                            <label className="cursor-pointer bg-white border border-gray-300 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-100 flex items-center gap-2 flex-1 justify-center">

                                {f.loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}

                                {f.image ? 'Change Image' : 'Upload Image'}

                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFinishImageUpload(e, idx)} disabled={f.loading} />

                            </label>

                        </div>

                    </div>

                    ))}

                    {finishes.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No finishes added.</p>}

                </div>

            </div>

        </div>



        {/* Standard Gallery */}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">

                <ImageIcon size={18} /> Standard Gallery (Extra Views)

            </h3>

            <div className="flex flex-wrap gap-4">

                {formData.images.map((img, idx) => (

                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">

                    <img src={img} alt="" className="w-full h-full object-cover" />

                    <button type="button" onClick={() => setFormData(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))} className="absolute top-1 right-1 bg-white text-red-500 p-1 rounded-full shadow opacity-0 group-hover:opacity-100">

                    <X size={14} />

                    </button>

                </div>

                ))}

                <label className={`w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${uploading ? 'opacity-50' : ''}`}>

                {uploading ? <Loader2 className="animate-spin" /> : <Upload className="text-gray-400" />}

                <span className="text-xs text-gray-500 mt-2">Upload</span>

                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />

                </label>

            </div>

        </div>



        <div className="flex justify-end pt-4 pb-12">

          <button type="submit" disabled={loading} className="bg-black text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 text-lg">

            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}

            {isEditMode ? 'Update Product' : 'Save Product'}

          </button>

        </div>



      </form>

    </div>

  );

};



export default AddProduct;