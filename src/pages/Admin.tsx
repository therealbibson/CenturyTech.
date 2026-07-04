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
  const [productForm, setProductForm] = useState<{
    name: string;
    category: string;
    brand: string;
    price: string;
    image: string | File;
    description: string;
    rating: string;
  }>(initialProduct);
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    icon: string | File;
  }>(initialCategory);
  const [brandForm, setBrandForm] = useState<{
    name: string;
    logo: string | File;
  }>(initialBrand);
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

    if (kind === 'product' && mode === 'edit' && item) {
      const productItem = item as Product;
      setEditingProductId(productItem.id);
      setProductForm({
        name: productItem.name,
        category: productItem.category,
        brand: productItem.brand || '',
        price: String(productItem.price),
        image: productItem.image,
        description: productItem.description,
        rating: String(productItem.rating || 5)
      });
      setProductImagePreview(productItem.image);
    }

    if (kind === 'category' && mode === 'edit' && item) {
      const categoryItem = item as Category;
      setEditingCategoryId(categoryItem._id || null);
      setCategoryForm({
        name: categoryItem.name,
        icon: categoryItem.icon
      });
      setCategoryIconPreview(categoryItem.icon);
    }

    if (kind === 'brand' && mode === 'edit' && item) {
      const brandItem = item as Brand;
      setEditingBrandId(brandItem._id || null);
      setBrandForm({
        name: brandItem.name,
        logo: brandItem.logo
      });
      setBrandLogoPreview(brandItem.logo);
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
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#0F172A] min-h-screen relative overflow-hidden font-sans">
      {/* Modern gradient accent glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/5 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]"></div>

      <div className="max-w-7xl mx-auto animate-fade-in relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col lg:flex-row lg:items-start gap-6"
        >
          {/* Sidebar Nav */}
          <div className="lg:w-72 shrink-0 rounded-2xl border border-slate-250 bg-white p-5 shadow-sm">
            <div className="mb-5 pb-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Admin Console</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Manage storefront items, catalog directories, and feedback approval.</p>
            </div>
            <nav className="space-y-1">
              {[
                { key: 'products', label: 'Products', icon: <FaBoxes /> },
                { key: 'categories', label: 'Categories', icon: <FaTags /> },
                { key: 'brands', label: 'Brands', icon: <FaAward /> },
                { key: 'testimonials', label: 'Testimonials', icon: <FaCommentAlt /> }
              ].map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as typeof activeTab)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/10'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span className="grow">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Panel Content */}
          <div className="flex-1 w-full">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'products' ? 'Products Catalog' : activeTab === 'categories' ? 'Categories Folder' : activeTab === 'brands' ? 'Brands Directory' : 'Customer Testimonials'}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {activeTab === 'products' && 'View, update, or clear retail items listed on the store.'}
                  {activeTab === 'categories' && 'Design organizational classifications for product sorting.'}
                  {activeTab === 'brands' && 'Register hardware manufacturer profiles and corporate emblems.'}
                  {activeTab === 'testimonials' && 'Moderate customer statements and toggle homepage highlights.'}
                </p>
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'products') openModal('product');
                  if (activeTab === 'categories') openModal('category');
                  if (activeTab === 'brands') openModal('brand');
                  if (activeTab === 'testimonials') openModal('testimonial');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow hover:shadow-blue-500/10 cursor-pointer hover:from-blue-700 hover:to-indigo-750 transition-all duration-200"
              >
                <FaPlus size={12} /> Add {activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : activeTab === 'brands' ? 'Brand' : 'Testimonial'}
              </button>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-850 font-medium flex items-center justify-between text-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <FaCheck className="text-emerald-600 shrink-0" />
                    <span>{message}</span>
                  </div>
                  <button onClick={() => setMessage('')} className="text-emerald-500 hover:text-emerald-800 cursor-pointer transition ml-2"><FaTimes /></button>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-rose-50/60 border border-rose-100 text-rose-850 font-medium flex items-center justify-between text-sm shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                    <span>{error}</span>
                  </div>
                  <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-800 cursor-pointer transition ml-2"><FaTimes /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <SummaryCard label="Products" value={products.length} icon={<FaBoxes className="text-blue-500" />} />
              <SummaryCard label="Categories" value={categories.length} icon={<FaTags className="text-purple-500" />} />
              <SummaryCard label="Brands" value={brands.length} icon={<FaAward className="text-amber-500" />} />
              <SummaryCard label="Testimonials" value={testimonials.length} icon={<FaCommentAlt className="text-rose-500" />} />
            </div>

            {/* Content Panes */}
            {loading ? (
              <div className="py-24 text-center text-slate-400 border border-slate-100 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
                <p className="font-semibold text-sm">Loading console dashboard...</p>
              </div>
            ) : (
              <div className="w-full">
                
                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <h2 className="text-base font-bold flex items-center gap-2 text-slate-800">
                        <FaBoxes className="text-blue-500" /> Products Catalog ({filteredProducts.length})
                      </h2>
                      <input
                        type="text"
                        placeholder="Search model or category..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="px-3.5 py-2 w-full sm:w-72 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-800 transition-all duration-200 font-medium"
                      />
                    </div>

                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                      {filteredProducts.length === 0 ? (
                        <p className="text-center py-20 text-slate-450 text-sm font-medium">No products found matching your search query.</p>
                      ) : (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                              <th className="pb-3 w-16">Item</th>
                              <th className="pb-3 pl-4">Details</th>
                              <th className="pb-3 text-right">Price</th>
                              <th className="pb-3 text-right pr-4">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((product) => (
                              <tr key={product.id} className="group hover:bg-slate-50/50 transition duration-150">
                                <td className="py-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-11 h-11 rounded-lg object-cover border border-slate-200/65"
                                  />
                                </td>
                                <td className="py-3 pl-4">
                                  <div className="font-bold text-slate-850 text-sm group-hover:text-blue-600 transition duration-150">{product.name}</div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{product.category}</div>
                                </td>
                                <td className="py-3 text-right font-bold text-slate-900 text-sm">
                                  <span className="text-slate-400 font-normal text-xs mr-0.5">$</span>{product.price.toLocaleString()}
                                </td>
                                <td className="py-3 text-right pr-4">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleEditProduct(product)}
                                      className="p-2 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm hover:shadow"
                                      title="Edit product"
                                    >
                                      <FaEdit size={12} />
                                    </button>
                                    {confirmDelete?.type === 'product' && confirmDelete.id === product.id ? (
                                      <div className="flex gap-1 justify-end">
                                        <button
                                          onClick={() => handleDeleteProduct(product.id)}
                                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => setConfirmDelete(null)}
                                          className="px-2.5 py-1 bg-slate-105 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setConfirmDelete({ type: 'product', id: product.id })}
                                        className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm hover:shadow"
                                        title="Delete product"
                                      >
                                        <FaTrash size={12} />
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
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-6 text-slate-800">
                      <FaTags className="text-purple-500" /> Existing Categories ({categories.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                      {categories.map((category) => (
                        <div key={category.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm rounded-xl flex flex-col items-center justify-between text-center gap-3 transition-all duration-200">
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={category.icon}
                              alt={category.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-sm"
                            />
                            <div>
                              <div className="font-bold text-slate-850 text-sm">{category.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">ID: {category.id}</div>
                            </div>
                          </div>
                          <div className="flex gap-1.5 w-full justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditCategory(category)}
                              className="p-2 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm"
                              title="Edit category"
                            >
                              <FaEdit size={11} />
                            </button>
                            {confirmDelete?.type === 'category' && confirmDelete.id === category._id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDeleteCategory(category._id || '')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  OK
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete({ type: 'category', id: category._id })}
                                className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm"
                                title="Delete category"
                              >
                                <FaTrash size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-400 text-sm">No folders or categories found.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Brands Tab */}
                {activeTab === 'brands' && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-6 text-slate-800">
                      <FaAward className="text-amber-500" /> Manufacturer Brands ({brands.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                      {brands.map((brand, index) => (
                        <div key={brand._id || index} className="p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:shadow-sm rounded-xl flex flex-col items-center justify-between text-center gap-3 transition-all duration-200">
                          <div className="flex flex-col items-center gap-2">
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-sm"
                            />
                            <div className="font-bold text-slate-850 text-sm mt-1">{brand.name}</div>
                          </div>
                          <div className="flex gap-1.5 w-full justify-center">
                            <button
                              type="button"
                              onClick={() => handleEditBrand(brand)}
                              className="p-2 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm"
                              title="Edit brand"
                            >
                              <FaEdit size={11} />
                            </button>
                            {confirmDelete?.type === 'brand' && confirmDelete.id === brand._id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDeleteBrand(brand._id || '')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  OK
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete({ type: 'brand', id: brand._id })}
                                className="p-2 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg hover:scale-105 transition cursor-pointer shadow-sm"
                                title="Delete brand"
                              >
                                <FaTrash size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {brands.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-400 text-sm">No registered brands found.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Testimonials Tab */}
                {activeTab === 'testimonials' && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-6 text-slate-800">
                      <FaCommentAlt className="text-rose-500" /> Customer Testimonials ({testimonials.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                      {testimonials.map((test, index) => (
                        <div key={test._id || index} className="p-5 bg-slate-50/50 border border-slate-200/80 hover:border-slate-300 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                          <div>
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div className="flex text-amber-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  i < test.rating ? <FaStar key={i} size={12} /> : <FaRegStar key={i} size={12} />
                                ))}
                              </div>
                              <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${test.approved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {test.approved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                            <p className="text-slate-600 italic text-sm mb-4 leading-relaxed">"{test.text}"</p>
                          </div>
                          <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
                            <div className="text-xs text-slate-800 font-bold">{test.name}</div>
                            <div className="flex gap-1.5 items-center">
                              <button
                                type="button"
                                onClick={() => handleToggleTestimonialApproval(test)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${test.approved ? 'bg-white hover:bg-slate-50 text-slate-650 border-slate-200' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm shadow-blue-500/10'}`}
                              >
                                {test.approved ? 'Unapprove' : 'Approve'}
                              </button>
                              {confirmDelete?.type === 'testimonial' && confirmDelete.id === test._id ? (
                                <div className="flex gap-1 items-center">
                                  <button
                                    onClick={() => handleDeleteTestimonial(test._id || '')}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete({ type: 'testimonial', id: test._id })}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition cursor-pointer border border-rose-100"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {testimonials.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-400 text-sm">No client reviews found.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal overlays */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4 py-8"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 15, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-y-auto max-h-full"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {modalMode === 'edit' ? `Edit ${modalKind.toUpperCase()}` : `Add New ${modalKind.toUpperCase()}`}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {modalKind === 'product' && 'Supply product specs, price tiers, categories and product files.'}
                    {modalKind === 'category' && 'Configure custom groupings and upload category icon.'}
                    {modalKind === 'brand' && 'Update manufacturer names and upload vector corporate logos.'}
                    {modalKind === 'testimonial' && 'Submit an honest reviewer opinion directly to approval stack.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {modalKind === 'product' && (
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <TextInput label="Product Name" value={productForm.name} onChange={(value) => setProductForm({ ...productForm, name: value })} required placeholder="e.g. MacBook Pro 16-inch M3 Max" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700">Category Folder</span>
                      <select
                        value={productForm.category}
                        onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition duration-150"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                        {categories.length === 0 && <option value="">No categories created yet</option>}
                      </select>
                    </div>
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700">Manufacturer Brand</span>
                      <select
                        value={productForm.brand}
                        onChange={(event) => setProductForm({ ...productForm, brand: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition duration-150"
                      >
                        <option value="">No Brand Tag</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand.name}>{brand.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Price ($)" type="number" value={productForm.price} onChange={(value) => setProductForm({ ...productForm, price: value })} required placeholder="e.g. 1999" min="0" step="0.01" />
                    <div>
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700">Review Star Score</span>
                      <select
                        value={productForm.rating}
                        onChange={(event) => setProductForm({ ...productForm, rating: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition duration-150"
                        required
                      >
                        <option value="5">5.0 / 5 stars</option>
                        <option value="4.5">4.5 / 5 stars</option>
                        <option value="4">4.0 / 5 stars</option>
                        <option value="3">3.0 / 5 stars</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="mb-1.5 block text-xs font-semibold text-slate-700">Product Representation Image</span>
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
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-1.5 file:font-semibold file:text-blue-700 hover:file:bg-blue-100 transition file:cursor-pointer"
                    />
                    {productImagePreview && <img src={productImagePreview} alt="Preview" className="mt-3 h-28 w-full rounded-xl border border-slate-200 object-cover shadow-sm" />}
                  </div>
                  <TextArea label="Description Specs" value={productForm.description} onChange={(value) => setProductForm({ ...productForm, description: value })} required placeholder="Input detailed specs, features, colors, and availability..." />
                  <div className="flex gap-3 pt-2">
                    <SubmitButton label={modalMode === 'edit' ? 'Apply Product Updates' : 'Add Item to Catalog'} busy={saving === 'product'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'category' && (
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <TextInput label="Category Directory Name" value={categoryForm.name} onChange={(value) => setCategoryForm({ ...categoryForm, name: value })} required placeholder="e.g. Wearables & Fitness" />
                  <div>
                    <span className="mb-1.5 block text-xs font-semibold text-slate-700">Category Icon File</span>
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
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-850 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-1.5 file:font-semibold file:text-purple-700 hover:file:bg-purple-100 transition file:cursor-pointer"
                      required={!editingCategoryId}
                    />
                    {categoryIconPreview && <img src={categoryIconPreview} alt="Preview" className="mt-3 h-24 w-full rounded-xl border border-slate-200 object-cover shadow-sm" />}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <SubmitButton label={modalMode === 'edit' ? 'Save Category Updates' : 'Publish Category'} busy={saving === 'category'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'brand' && (
                <form onSubmit={handleSaveBrand} className="space-y-4">
                  <TextInput label="Brand Name" value={brandForm.name} onChange={(value) => setBrandForm({ ...brandForm, name: value })} required placeholder="e.g. Samsung Electronics" />
                  <div>
                    <span className="mb-1.5 block text-xs font-semibold text-slate-700">Brand Corporate Emblem</span>
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
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-4 file:py-1.5 file:font-semibold file:text-amber-700 hover:file:bg-amber-100 transition file:cursor-pointer"
                      required={!editingBrandId}
                    />
                    {brandLogoPreview && <img src={brandLogoPreview} alt="Preview" className="mt-3 h-24 w-full rounded-xl border border-slate-200 object-cover shadow-sm" />}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <SubmitButton label={modalMode === 'edit' ? 'Save Brand Updates' : 'Publish Brand Profile'} busy={saving === 'brand'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              {modalKind === 'testimonial' && (
                <form onSubmit={handleCreateTestimonial} className="space-y-4">
                  <TextInput label="Customer Reviewer Name" value={testimonialForm.name} onChange={(value) => setTestimonialForm({ ...testimonialForm, name: value })} required placeholder="e.g. Sarah Jenkins" />
                  <TextArea label="Opinion Feedback Content" value={testimonialForm.text} onChange={(value) => setTestimonialForm({ ...testimonialForm, text: value })} required placeholder="State details shared by the customer regarding their storefront experience..." />
                  <div>
                    <span className="mb-1.5 block text-xs font-semibold text-slate-700">Rating Score</span>
                    <select
                      value={testimonialForm.rating}
                      onChange={(event) => setTestimonialForm({ ...testimonialForm, rating: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition duration-150"
                      required
                    >
                      <option value="5">5.0 / 5 stars</option>
                      <option value="4">4.0 / 5 stars</option>
                      <option value="3">3.0 / 5 stars</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <SubmitButton label="Publish Testimonial Item" busy={saving === 'testimonial'} />
                    <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer">Cancel</button>
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
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      className="bg-white border border-slate-200/80 rounded-xl p-4.5 flex items-center justify-between shadow-sm hover:border-slate-350 transition-all duration-300"
    >
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-800 tracking-tight mt-1">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-sm shadow-sm">
        {icon}
      </div>
    </motion.div>
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
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-slate-800 text-sm placeholder:text-gray-400 font-medium"
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
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-slate-800 text-sm placeholder:text-gray-400 resize-none font-sans font-medium"
      />
    </label>
  );
}

function SubmitButton({ label, busy }: { label: string; busy: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      type="submit"
      disabled={busy}
      className="grow py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {busy && <FaSpinner className="animate-spin" />}
      {busy ? 'Saving changes...' : label}
    </motion.button>
  );
}
