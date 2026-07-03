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
  FaRegStar,
  FaEdit
} from 'react-icons/fa';
import { api, type Brand, type Category, type Testimonial } from '../services/api';
import { type Product } from '../data/products';
import DynamicFaIcon from '../components/DynamicFaIcon';
import { useAuth } from '../context/AuthContext';



const initialProduct = {
  name: '',
  category: '',
  brand: '',
  price: '',
  image: '',
  description: '',
  rating: '5'
};

const initialCategory = {
  name: '',
  icon: ''
};

const initialBrand = {
  name: '',
  logo: ''
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
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // Image preview states
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [brandLogoPreview, setBrandLogoPreview] = useState<string>('');
  const [categoryIconPreview, setCategoryIconPreview] = useState<string>('');

  // Search query for lists
  const [productSearch, setProductSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKind, setModalKind] = useState<'product' | 'category' | 'brand' | 'testimonial'>('product');
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

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
        api.getTestimonialsAdmin()
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setBrands(fetchedBrands);
      setTestimonials(fetchedTestimonials);
      
      // Default the category and brand in productForm to the first fetched items
      if (fetchedCategories.length > 0) {
        setProductForm(prev => ({ ...prev, category: fetchedCategories[0].name }));
      } else {
        setProductForm(prev => ({ ...prev, category: 'Laptops' }));
      }
      if (fetchedBrands.length > 0) {
        setProductForm(prev => ({ ...prev, brand: fetchedBrands[0].name }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }



  const handleSaveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('product');
    setError('');
    setMessage('');

    try {
      const defaultImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop';
      const payload = {
        name: productForm.name,
        category: productForm.category || 'Laptops',
        brand: productForm.brand || '',
        price: Number(productForm.price),
        image: productForm.image || defaultImage,
        description: productForm.description,
        rating: Number(productForm.rating)
      };

      if (editingProductId) {
        const updatedProduct = await api.updateProduct(editingProductId, payload);
        setProducts((current) => current.map((p) => (p.id === editingProductId ? updatedProduct : p)));
        setEditingProductId(null);
        setMessage(`Product "${updatedProduct.name}" updated successfully.`);
      } else {
        const product = await api.createProduct(payload);
        setProducts((current) => [...current, product]);
        setMessage(`Product "${product.name}" added successfully.`);
      }

      setIsModalOpen(false);
      resetAdminForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSaving('');
    }
  };

  const resetAdminForms = () => {
    setEditingProductId(null);
    setEditingCategoryId(null);
    setEditingBrandId(null);
    setProductForm({
      ...initialProduct,
      category: categories.length > 0 ? categories[0].name : 'Laptops',
      brand: brands.length > 0 ? brands[0].name : ''
    });
    setCategoryForm(initialCategory);
    setBrandForm(initialBrand);
    setTestimonialForm(initialTestimonial);
    setProductImagePreview('');
    setBrandLogoPreview('');
    setCategoryIconPreview('');
    setConfirmDelete(null);
  };

  const openModal = (kind: 'product' | 'category' | 'brand' | 'testimonial', mode: 'create' | 'edit' = 'create', item?: Product | Category | Brand | Testimonial) => {
    resetAdminForms();
    setModalKind(kind);
    setModalMode(mode);

    if (kind === 'product' && mode === 'edit' && item && 'id' in item) {
      setEditingProductId(item.id);
      setProductForm({
        name: item.name,
        category: item.category,
        brand: item.brand || '',
        price: String(item.price),
        image: item.image,
        description: item.description,
        rating: String(item.rating || 5)
      });
      setProductImagePreview(item.image);
    }

    if (kind === 'category' && mode === 'edit' && item && '_id' in item) {
      setEditingCategoryId(item._id || null);
      setCategoryForm({
        name: item.name,
        icon: item.icon
      });
      setCategoryIconPreview(item.icon);
    }

    if (kind === 'brand' && mode === 'edit' && item && '_id' in item) {
      setEditingBrandId(item._id || null);
      setBrandForm({
        name: item.name,
        logo: item.logo
      });
      setBrandLogoPreview(item.logo);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('create');
    resetAdminForms();
  };

  const handleEditProduct = (product: Product) => {
    openModal('product', 'edit', product);
  };

  const handleCancelProductEdit = () => {
    closeModal();
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

  const handleSaveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('category');
    setError('');
    setMessage('');

    try {
      if (editingCategoryId) {
        const updatedCategory = await api.updateCategory(editingCategoryId, categoryForm);
        setCategories((current) => current.map((c) => (c._id === editingCategoryId ? updatedCategory : c)));
        setMessage(`Category "${updatedCategory.name}" updated successfully.`);
        setEditingCategoryId(null);
      } else {
        const category = await api.createCategory(categoryForm);
        setCategories((current) => [...current, category]);
        setMessage(`Category "${category.name}" added successfully.`);
      }

      setProductForm(prev => prev.category ? prev : { ...prev, category: categoryForm.name });
      setIsModalOpen(false);
      resetAdminForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category.');
    } finally {
      setSaving('');
    }
  };

  const handleEditCategory = (category: Category) => {
    openModal('category', 'edit', category);
  };

  const handleCancelCategoryEdit = () => {
    closeModal();
  };

  const handleDeleteCategory = async (id: string) => {
    setConfirmDelete(null);
    setError('');
    setMessage('');
    try {
      await api.deleteCategory(id);
      setCategories((current) => current.filter((category) => category._id !== id));
      setMessage('Category deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category.');
    }
  };

  const handleSaveBrand = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving('brand');
    setError('');
    setMessage('');

    try {
      if (editingBrandId) {
        const updatedBrand = await api.updateBrand(editingBrandId, brandForm);
        setBrands((current) => current.map((b) => (b._id === editingBrandId ? updatedBrand : b)));
        setMessage(`Brand "${updatedBrand.name}" updated successfully.`);
        setEditingBrandId(null);
      } else {
        const brand = await api.createBrand(brandForm);
        setBrands((current) => [...current, brand]);
        setMessage(`Brand "${brand.name}" added successfully.`);
      }

      setIsModalOpen(false);
      resetAdminForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save brand.');
    } finally {
      setSaving('');
    }
  };

  const handleEditBrand = (brand: Brand) => {
    openModal('brand', 'edit', brand);
  };

  const handleCancelBrandEdit = () => {
    closeModal();
  };

  const handleDeleteBrand = async (id: string) => {
    setConfirmDelete(null);
    setError('');
    setMessage('');
    try {
      await api.deleteBrand(id);
      setBrands((current) => current.filter((brand) => brand._id !== id));
      setMessage('Brand deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete brand.');
    }
  };

  const handleToggleTestimonialApproval = async (testimonial: Testimonial) => {
    setError('');
    setMessage('');
    try {
      const updatedTestimonial = await api.approveTestimonial(testimonial._id || '', !testimonial.approved);
      setTestimonials((current) => current.map((t) => (t._id === updatedTestimonial._id ? updatedTestimonial : t)));
      setMessage(`Testimonial "${updatedTestimonial.name}" ${updatedTestimonial.approved ? 'approved' : 'unapproved'}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    setConfirmDelete(null);
    setError('');
    setMessage('');
    try {
      await api.deleteTestimonial(id);
      setTestimonials((current) => current.filter((t) => t._id !== id));
      setMessage('Testimonial deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial.');
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
      setIsModalOpen(false);
      resetAdminForms();
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto animate-fade-in relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col lg:flex-row lg:items-start gap-6"
        >
          <div className="lg:w-72 shrink-0 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0F172A]">Admin Panel</h2>
              <p className="text-sm text-gray-600 mt-2">Manage storefront content with a focused sidebar.</p>
            </div>
            <nav className="space-y-2">
              {[
                { key: 'products', label: 'Products', icon: <FaBoxes /> },
                { key: 'categories', label: 'Categories', icon: <FaTags /> },
                { key: 'brands', label: 'Brands', icon: <FaAward /> },
                { key: 'testimonials', label: 'Testimonials', icon: <FaCommentAlt /> }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as typeof activeTab)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === item.key ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              <div className="font-semibold">Connected to DB</div>
              <div className="text-xs mt-1">All CRUD actions update the live database.</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#0F172A]">{activeTab === 'products' ? 'Products' : activeTab === 'categories' ? 'Categories' : activeTab === 'brands' ? 'Brands' : 'Testimonials'}</h1>
                <p className="text-lg text-gray-600 mt-2">Create, edit, and remove store items from here.</p>
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'products') openModal('product');
                  if (activeTab === 'categories') openModal('category');
                  if (activeTab === 'brands') openModal('brand');
                  if (activeTab === 'testimonials') openModal('testimonial');
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                <FaPlus /> Add {activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : activeTab === 'brands' ? 'Brand' : 'Testimonial'}
              </button>
            </div>

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
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200/50 rounded-xl hover:scale-105 transition cursor-pointer"
                                    title="Edit product"
                                  >
                                    <FaEdit size={14} />
                                  </button>
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
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
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
                      <div key={category.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <div className="font-bold text-gray-800">{category.name}</div>
                            <div className="text-xs text-gray-500">ID: {category.id}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(category)}
                            className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200/50 rounded-xl hover:scale-105 transition"
                            title="Edit category"
                          >
                            <FaEdit size={14} />
                          </button>
                          {confirmDelete?.type === 'category' && confirmDelete.id === category._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteCategory(category._id || '')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete({ type: 'category', id: category._id })}
                              className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200/50 rounded-xl hover:scale-105 transition"
                              title="Delete category"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="col-span-full py-16 text-center text-gray-450">No categories found.</div>
                    )}
                  </div>
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
                      <div key={brand._id || index} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-between text-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          />
                          <div className="font-bold text-gray-800 text-sm">{brand.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditBrand(brand)}
                            className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200/50 rounded-xl hover:scale-105 transition"
                            title="Edit brand"
                          >
                            <FaEdit size={14} />
                          </button>
                          {confirmDelete?.type === 'brand' && confirmDelete.id === brand._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteBrand(brand._id || '')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete({ type: 'brand', id: brand._id })}
                              className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200/50 rounded-xl hover:scale-105 transition"
                              title="Delete brand"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {brands.length === 0 && (
                      <div className="col-span-full py-16 text-center text-gray-450">No brands found.</div>
                    )}
                  </div>
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
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex text-amber-500 gap-1">
                            {[...Array(5)].map((_, i) => (
                              i < test.rating ? <FaStar key={i} size={14} /> : <FaRegStar key={i} size={14} />
                            ))}
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${test.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {test.approved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-700 italic text-sm mb-3">"{test.text}"</p>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs text-gray-500 font-bold">- {test.name}</div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleTestimonialApproval(test)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition"
                            >
                              {test.approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete({ type: 'testimonial', id: test._id })}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {confirmDelete?.type === 'testimonial' && confirmDelete.id === test._id && (
                          <div className="mt-3 flex gap-2 justify-end">
                            <button
                              onClick={() => handleDeleteTestimonial(test._id || '')}
                              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <div className="py-16 text-center text-gray-450">No testimonials found.</div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
        </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">
                    {modalMode === 'edit' ? `Edit ${modalKind}` : `Create ${modalKind}`}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {modalKind === 'product' && 'Update the product details quickly.'}
                    {modalKind === 'category' && 'Add or refine a category for the storefront.'}
                    {modalKind === 'brand' && 'Manage a brand card and logo.'}
                    {modalKind === 'testimonial' && 'Add a testimonial for public approval.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {modalKind === 'product' && (
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <TextInput label="Product Name" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} required placeholder="e.g. MacBook Pro M3" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Category</span>
                    <select
                      value={productForm.category}
                      onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                      {categories.length === 0 && <option value="">No categories created yet</option>}
                    </select>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Brand</span>
                    <select
                      value={productForm.brand}
                      onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                    >
                      <option value="">No Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand.name}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <TextInput label="Price ($)" type="number" value={productForm.price} onChange={(value) => setProductForm({ ...productForm, price: value })} required placeholder="e.g. 1299" min="0" step="0.01" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Product Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setProductForm({ ...productForm, image: file });
                          setProductImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {productImagePreview && <img src={productImagePreview} alt="Preview" className="mt-3 h-32 w-full rounded-xl border border-gray-200 object-cover" />}
                  </div>
                  <TextArea label="Description" value={productForm.description} onChange={(value) => setProductForm({ ...productForm, description: value })} required placeholder="Describe the product" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Rating (1-5)</span>
                    <select
                      value={productForm.rating}
                      onChange={(event) => setProductForm({ ...productForm, rating: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                      required
                    >
                      <option value="5">5 stars</option>
                      <option value="4.5">4.5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <SubmitButton label={modalMode === 'edit' ? 'Update Product' : 'Save Product'} busy={saving === 'product'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'category' && (
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <TextInput label="Category Name" value={categoryForm.name} onChange={(value) => setCategoryForm({ ...categoryForm, name: value })} required placeholder="e.g. Smart Watches" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Category Icon</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setCategoryForm({ ...categoryForm, icon: file });
                          setCategoryIconPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
                      required={!editingCategoryId}
                    />
                    {categoryIconPreview && <img src={categoryIconPreview} alt="Preview" className="mt-3 h-24 w-full rounded-xl border border-gray-200 object-cover" />}
                  </div>
                  <div className="flex gap-3">
                    <SubmitButton label={modalMode === 'edit' ? 'Update Category' : 'Save Category'} busy={saving === 'category'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'brand' && (
                <form onSubmit={handleSaveBrand} className="space-y-4">
                  <TextInput label="Brand Name" value={brandForm.name} onChange={(value) => setBrandForm({ ...brandForm, name: value })} required placeholder="e.g. Apple" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Brand Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setBrandForm({ ...brandForm, logo: file });
                          setBrandLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
                      required={!editingBrandId}
                    />
                    {brandLogoPreview && <img src={brandLogoPreview} alt="Preview" className="mt-3 h-24 w-full rounded-xl border border-gray-200 object-cover" />}
                  </div>
                  <div className="flex gap-3">
                    <SubmitButton label={modalMode === 'edit' ? 'Update Brand' : 'Save Brand'} busy={saving === 'brand'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'testimonial' && (
                <form onSubmit={handleCreateTestimonial} className="space-y-4">
                  <TextInput label="Customer Name" value={testimonialForm.name} onChange={(value) => setTestimonialForm({ ...testimonialForm, name: value })} required placeholder="e.g. John Doe" />
                  <TextArea label="Feedback Text" value={testimonialForm.text} onChange={(value) => setTestimonialForm({ ...testimonialForm, text: value })} required placeholder="Share the customer feedback" />
                  <div>
                    <span className="mb-1.5 block text-sm font-semibold text-gray-700">Rating</span>
                    <select
                      value={testimonialForm.rating}
                      onChange={(event) => setTestimonialForm({ ...testimonialForm, rating: event.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 focus:border-[#2563EB] focus:bg-white focus:outline-none"
                      required
                    >
                      <option value="5">5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <SubmitButton label="Save Testimonial" busy={saving === 'testimonial'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
