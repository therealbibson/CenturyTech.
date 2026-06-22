import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { type Product } from '../data/products';
import { api } from '../services/api';

const getProductKey = (product: Product) => product._id || product.id;

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Laptops',
    price: '',
    image: '',
    description: '',
    rating: '5'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await api.getProducts();
        setProductsList(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await api.createProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        image: newProduct.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        description: newProduct.description,
        rating: Number(newProduct.rating)
      });
      // Add the new product to the list immediately
      setProductsList((prev) => [...prev, created]);
      // Reset form
      setNewProduct({
        name: '',
        category: 'Laptops',
        price: '',
        image: '',
        description: '',
        rating: '5'
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add product to the database.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'all',
    'Laptops',
    'MacBook',
    'HP',
    'Dell',
    'Lenovo',
    'Asus',
    'Acer',
    'iPhone',
    'Samsung',
    'Xiaomi',
    'Tecno',
    'Infinix',
    'iPad',
    'Galaxy Tab',
    'Earbuds',
    'Chargers',
    'Power Banks',
    'Smart Watches'
  ];

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productsList, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 pt-16">
        <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-[#2563EB] animate-pulse">
          Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl font-bold text-[#0F172A] mb-4">Our Products</h1>
            <p className="text-xl text-gray-600">
              Explore our collection of premium laptops, smartphones, tablets, and accessories
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2563EB] outline-none text-lg"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-8"
        >
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={getProductKey(product)} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            <div className="bg-[#2563EB] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add New Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none"
                  placeholder="e.g. iPhone 16 Pro Max"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none bg-white"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="MacBook">MacBook</option>
                    <option value="HP">HP</option>
                    <option value="Dell">Dell</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Asus">Asus</option>
                    <option value="Acer">Acer</option>
                    <option value="iPhone">iPhone</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                    <option value="iPad">iPad</option>
                    <option value="Galaxy Tab">Galaxy Tab</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Chargers">Chargers</option>
                    <option value="Power Banks">Power Banks</option>
                    <option value="Smart Watches">Smart Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none"
                    placeholder="e.g. 999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none resize-none"
                  placeholder="Short description of the product..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  required
                  value={newProduct.rating}
                  onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-bold hover:bg-blue-800 transition-colors disabled:bg-blue-300"
                >
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
