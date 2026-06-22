import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock,
  FaTrash,
  FaBoxes,
  FaTags,
  FaAward,
  FaCommentAlt,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import { api, type Brand, type Category, type Testimonial } from '../services/api';
import { type Product } from '../data/products';
import DynamicFaIcon from '../components/DynamicFaIcon';
import { useAuth } from '../context/AuthContext';



const initialProduct = {
  name: '',
  category: '',
  price: '',
  image: '',
  description: '',
  rating: '5'
};

const initialCategory = {
  name: '',
  icon: 'FaLaptop'
};

const initialBrand = {
  name: '',
  logo: 'FaApple'
};

const initialTestimonial = {
  name: '',
  text: '',
  rating: '5'
};

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands' | 'testimonials'>('products');
  const [productForm, setProductForm] = useState(initialProduct);
  const [categoryForm, setCategoryForm] = useState(initialCategory);
  const [brandForm, setBrandForm] = useState(initialBrand);
  const [testimonialForm, setTestimonialForm] = useState(initialTestimonial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: any } | null>(null);
  
  // Search query for lists
  const [productSearch, setProductSearch] = useState('');

  // Suggestions for React Icons
  const categoryIcons = [
    'FaLaptop',
    'FaMobileAlt',
    'FaTabletAlt',
    'FaClock',
    'FaHeadphones',
    'FaPlug',
    'FaTv',
    'FaKeyboard',
    'FaMouse',
    'FaGamepad',
    'FaCamera',
    'FaPrint'
  ];
  const brandLogos = [
    'FaApple',
    'FaAndroid',
    'FaWindows',
    'FaGoogle',
    'FaIntel',
    'FaPlaystation',
    'FaXbox',
    'FaHdd',
    'FaBriefcase',
    'FaMicrochip',
    'FaLeaf',
    'FaGlobe'
  ];

  // Fetch dashboard data if authenticated as admin
  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadDashboardData();
    }
  }, [authLoading, isAdmin]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedCategories, fetchedBrands, fetchedTestimonials] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBrands(),
        api.getTestimonials()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setBrands(fetchedBrands);
      setTestimonials(fetchedTestimonials);
      
      // Default the category in productForm to the first fetched category
      if (fetchedCategories.length > 0) {
        setProductForm(prev => ({ ...prev, category: fetchedCategories[0].name }));
      } else {
        setProductForm(prev => ({ ...prev, category: 'Laptops' }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }



  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('product');
    setError('');
    setMessage('');

    try {
      const defaultImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop';
      const product = await api.createProduct({
        name: productForm.name,
        category: productForm.category || 'Laptops',
        price: Number(productForm.price),
        image: productForm.image || defaultImage,
        description: productForm.description,
        rating: Number(productForm.rating)
      });
      
      setProducts((current) => [...current, product]);
      setProductForm({
        ...initialProduct,
        category: categories.length > 0 ? categories[0].name : 'Laptops'
      });
      setMessage(`Product "${product.name}" added successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product.');
    } finally {
      setSaving('');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setConfirmDelete(null);
    setError('');
    setMessage('');
    try {
      await api.deleteProduct(id);
      const deletedProduct = products.find(p => p.id === id);
      setProducts((current) => current.filter((p) => p.id !== id));
      setMessage(`Product "${deletedProduct?.name || id}" deleted successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  };

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('category');
    setError('');
    setMessage('');

    try {
      const category = await api.createCategory(categoryForm);
      setCategories((current) => [...current, category]);
      
      // Update productForm category option if it was empty
      setProductForm(prev => prev.category ? prev : { ...prev, category: category.name });
      setCategoryForm(initialCategory);
      setMessage(`Category "${category.name}" added successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category.');
    } finally {
      setSaving('');
    }
  };

  const handleCreateBrand = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('brand');
    setError('');
    setMessage('');

    try {
      const brand = await api.createBrand(brandForm);
      setBrands((current) => [...current, brand]);
      setBrandForm(initialBrand);
      setMessage(`Brand "${brand.name}" added successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add brand.');
    } finally {
      setSaving('');
    }
  };

  const handleCreateTestimonial = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('testimonial');
    setError('');
    setMessage('');

    try {
      const testimonial = await api.createTestimonial({
        name: testimonialForm.name,
        text: testimonialForm.text,
        rating: Number(testimonialForm.rating)
      });
      setTestimonials((current) => [...current, testimonial]);
      setTestimonialForm(initialTestimonial);
      setMessage(`Testimonial from "${testimonial.name}" added successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add testimonial.');
    } finally {
      setSaving('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-16">
        <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-[#2563EB] animate-pulse">
          Verifying authorization...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
        {/* Background blobs for premium styling */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-2xl relative z-10 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-2xl mb-4">
            <FaLock />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            This dashboard is restricted to administrator accounts only.
          </p>

          <div className="mt-8 space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="block w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-500/20 cursor-pointer text-center font-semibold text-lg"
              >
                Log in as Admin
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="block w-full py-3.5 bg-gray-100 hover:bg-gray-200 border border-gray-250 rounded-xl text-gray-700 font-bold transition text-center font-semibold text-lg"
              >
                Back to Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter products by search query
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#0F172A] min-h-screen relative overflow-hidden">
      {/* Background blobs for premium styling */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto animate-fade-in relative z-10">
        
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl font-bold text-[#0F172A] mb-4">
              Admin Control Panel
            </h1>
            <p className="text-xl text-gray-600">
              Add and manage products, categories, brands, and testimonials in real-time.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected to DB
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50 border-l-4 border-emerald-500 text-emerald-850 font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FaCheck /> {message}
              </div>
              <button onClick={() => setMessage('')} className="text-emerald-650 hover:text-emerald-850 cursor-pointer"><FaTimes /></button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border-l-4 border-red-500 text-red-850 font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> {error}
              </div>
              <button onClick={() => setError('')} className="text-rose-650 hover:text-rose-850 cursor-pointer"><FaTimes /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Products" value={products.length} icon={<FaBoxes className="text-blue-500" />} />
          <SummaryCard label="Categories" value={categories.length} icon={<FaTags className="text-purple-500" />} />
          <SummaryCard label="Brands" value={brands.length} icon={<FaAward className="text-amber-500" />} />
          <SummaryCard label="Testimonials" value={testimonials.length} icon={<FaCommentAlt className="text-rose-500" />} />
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')} label="Products" icon={<FaBoxes />} />
          <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} label="Categories" icon={<FaTags />} />
          <TabButton active={activeTab === 'brands'} onClick={() => setActiveTab('brands')} label="Brands" icon={<FaAward />} />
          <TabButton active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} label="Testimonials" icon={<FaCommentAlt />} />
        </div>

        {/* Content Panes */}
        {loading ? (
          <div className="py-24 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
            <p className="font-semibold">Loading console data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                      <FaBoxes className="text-blue-500" /> Existing Products
                    </h2>
                    <input
                      type="text"
                      placeholder="Search name or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="px-4 py-2 w-full sm:w-64 bg-gray-50 border border-gray-250 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] focus:bg-white text-gray-800"
                    />
                  </div>

                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.length === 0 ? (
                      <p className="text-center py-20 text-gray-400 font-medium">No products found matching query.</p>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-500 text-sm font-semibold">
                            <th className="pb-3 w-16">Item</th>
                            <th className="pb-3 pl-4">Details</th>
                            <th className="pb-3 text-right">Price</th>
                            <th className="pb-3 text-right pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-blue-50/20 transition">
                              <td className="py-4">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-gray-200 group-hover:scale-105 transition duration-200"
                                />
                              </td>
                              <td className="py-4 pl-4">
                                <div className="font-bold text-gray-800 group-hover:text-blue-600 transition">{product.name}</div>
                                <div className="text-xs text-gray-500 font-medium mt-0.5">{product.category}</div>
                              </td>
                              <td className="py-4 text-right font-bold text-gray-900">
                                ${product.price.toLocaleString()}
                              </td>
                              <td className="py-4 text-right pr-4">
                                {confirmDelete?.type === 'product' && confirmDelete.id === product.id ? (
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setConfirmDelete(null)}
                                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDelete({ type: 'product', id: product.id })}
                                    className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200/50 rounded-xl hover:scale-105 transition cursor-pointer"
                                    title="Delete product"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Add Product Form */}
                <div className="bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 h-fit shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-[#2563EB]">
                    <FaPlus size={16} /> Add Product
                  </h2>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <TextInput
                      label="Product Name"
                      value={productForm.name}
                      onChange={(value) => setProductForm({ ...productForm, name: value })}
                      required
                      placeholder="e.g. MacBook Pro M3"
                    />

                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-1.5">Category</span>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-gray-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition cursor-pointer"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        {categories.length === 0 && (
                          <option value="">No categories created yet</option>
                        )}
                      </select>
                    </div>

                    <TextInput
                      label="Price ($)"
                      type="number"
                      value={productForm.price}
                      onChange={(value) => setProductForm({ ...productForm, price: value })}
                      required
                      placeholder="e.g. 1299"
                    />

                    <TextInput
                      label="Image URL"
                      value={productForm.image}
                      onChange={(value) => setProductForm({ ...productForm, image: value })}
                      placeholder="Leave blank for placeholder image"
                    />

                    <TextArea
                      label="Description"
                      value={productForm.description}
                      onChange={(value) => setProductForm({ ...productForm, description: value })}
                      required
                      placeholder="Highlight features, specs, and details..."
                    />

                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-1.5">Rating (1-5)</span>
                      <select
                        value={productForm.rating}
                        onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-gray-850 focus:outline-none focus:border-[#2563EB] focus:bg-white transition cursor-pointer"
                        required
                      >
                        <option value="5">5 stars</option>
                        <option value="4.5">4.5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                      </select>
                    </div>

                    <SubmitButton label="Save Product" busy={saving === 'product'} />
                  </form>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Categories List */}
                  <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                    <FaTags className="text-purple-500" /> Existing Categories
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map((category) => (
                      <div key={category.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3">
                        <DynamicFaIcon name={category.icon} size={24} className="text-purple-550" />
                        <div>
                          <div className="font-bold text-gray-800">{category.name}</div>
                          <div className="text-xs text-gray-500">ID: {category.id}</div>
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-full py-16 text-center text-gray-450">No categories found.</div>
                    )}
                  </div>
                </div>

                {/* Add Category Form */}
                <div className="bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 h-fit shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-600">
                    <FaPlus size={16} /> Add Category
                  </h2>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <TextInput
                      label="Category Name"
                      value={categoryForm.name}
                      onChange={(value) => setCategoryForm({ ...categoryForm, name: value })}
                      required
                      placeholder="e.g. Smart Watches"
                    />

                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-2">Category Icon (React Icon)</span>
                      <div className="flex gap-2 flex-wrap mb-3 p-3 bg-gray-50/60 border border-gray-200 rounded-xl">
                        {categoryIcons.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setCategoryForm({ ...categoryForm, icon: iconName })}
                            className={`p-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-250 transition cursor-pointer flex items-center justify-center ${categoryForm.icon === iconName ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-100' : ''}`}
                            title={iconName}
                          >
                            <DynamicFaIcon name={iconName} size={20} className="text-purple-600" />
                          </button>
                        ))}
                      </div>
                      <TextInput
                        label="Selected Icon Name (Or Type Custom)"
                        value={categoryForm.icon}
                        onChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                        required
                        placeholder="e.g. FaLaptop"
                      />
                    </div>

                    <SubmitButton label="Save Category" busy={saving === 'category'} />
                  </form>
                </div>
              </div>
            )}

            {/* Brands Tab */}
            {activeTab === 'brands' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Brands List */}
                  <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                    <FaAward className="text-amber-500" /> Registered Brands
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {brands.map((brand, index) => (
                      <div key={brand._id || index} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                        <DynamicFaIcon name={brand.logo} size={24} className="text-amber-500" />
                        <div className="font-bold text-gray-800 text-sm">{brand.name}</div>
                      </div>
                    ))}
                    {brands.length === 0 && (
                      <div className="col-span-full py-16 text-center text-gray-450">No brands found.</div>
                    )}
                  </div>
                </div>

                {/* Add Brand Form */}
                <div className="bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 h-fit shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-amber-600">
                    <FaPlus size={16} /> Add Brand
                  </h2>
                  <form onSubmit={handleCreateBrand} className="space-y-4">
                    <TextInput
                      label="Brand Name"
                      value={brandForm.name}
                      onChange={(value) => setBrandForm({ ...brandForm, name: value })}
                      required
                      placeholder="e.g. Apple, Lenovo, Dell"
                    />

                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-2">Brand Logo (React Icon)</span>
                      <div className="flex gap-2 flex-wrap mb-3 p-3 bg-gray-50/60 border border-gray-200 rounded-xl">
                        {brandLogos.map((iconName) => (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => setBrandForm({ ...brandForm, logo: iconName })}
                            className={`p-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-250 transition cursor-pointer flex items-center justify-center ${brandForm.logo === iconName ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-100' : ''}`}
                            title={iconName}
                          >
                            <DynamicFaIcon name={iconName} size={20} className="text-amber-500" />
                          </button>
                        ))}
                      </div>
                      <TextInput
                        label="Selected Logo Icon Name"
                        value={brandForm.logo}
                        onChange={(value) => setBrandForm({ ...brandForm, logo: value })}
                        required
                        placeholder="e.g. FaApple"
                      />
                    </div>

                    <SubmitButton label="Save Brand" busy={saving === 'brand'} />
                  </form>
                </div>
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Testimonials List */}
                  <div className="lg:col-span-2 bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
                    <FaCommentAlt className="text-rose-500" /> Customer Testimonials
                  </h2>
                  <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                    {testimonials.map((test, index) => (
                      <div key={test._id || index} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div className="flex text-amber-500 gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            i < test.rating ? <FaStar key={i} size={14} /> : <FaRegStar key={i} size={14} />
                          ))}
                        </div>
                        <p className="text-gray-700 italic text-sm mb-3">"{test.text}"</p>
                        <div className="text-xs text-gray-500 font-bold">- {test.name}</div>
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <div className="py-16 text-center text-gray-450">No testimonials found.</div>
                    )}
                  </div>
                </div>

                {/* Add Testimonial Form */}
                <div className="bg-white/85 backdrop-blur-md border border-gray-100 rounded-3xl p-8 h-fit shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-rose-600">
                    <FaPlus size={16} /> Add Testimonial
                  </h2>
                  <form onSubmit={handleCreateTestimonial} className="space-y-4">
                    <TextInput
                      label="Customer Name"
                      value={testimonialForm.name}
                      onChange={(value) => setTestimonialForm({ ...testimonialForm, name: value })}
                      required
                      placeholder="e.g. John Doe"
                    />

                    <TextArea
                      label="Feedback Text"
                      value={testimonialForm.text}
                      onChange={(value) => setTestimonialForm({ ...testimonialForm, text: value })}
                      required
                      placeholder="Customer words, review details..."
                    />

                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</span>
                      <select
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-250 rounded-xl text-gray-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition cursor-pointer"
                        required
                      >
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                      </select>
                    </div>

                    <SubmitButton label="Save Testimonial" busy={saving === 'testimonial'} />
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-blue-50 border border-blue-100 hover:border-[#2563EB]/40 rounded-2xl p-5 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-white border border-blue-50 flex items-center justify-center text-xl shadow-sm">
        {icon}
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
        active
          ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-[#2563EB]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  min,
  max,
  step
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-750 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-755 mb-1.5">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 resize-none"
      />
    </label>
  );
}

function SubmitButton({ label, busy }: { label: string; busy: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={busy}
      className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {busy && <FaSpinner className="animate-spin" />}
      {busy ? 'Saving...' : label}
    </motion.button>
  );
}
