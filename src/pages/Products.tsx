import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { type Product } from '../data/products';
import { api, type Brand, type Category } from '../services/api';

const getProductKey = (product: Product) => product._id || product.id;

const defaultProductImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Laptops',
    brand: '',
    price: '',
    image: '',
    description: '',
    rating: '5'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const [fetchedProducts, fetchedCategories, fetchedBrands] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands()
        ]);
        setProductsList(fetchedProducts);
        setCategoriesList(fetchedCategories);
        setBrandsList(fetchedBrands);
        setNewProduct((current) => ({
          ...current,
          category: fetchedCategories[0]?.name || current.category,
          brand: fetchedBrands[0]?.name || current.brand
        }));
      } catch (err) {
        console.error('Error fetching products from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const updateFilter = (type: 'category' | 'brand', value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete(type);
    } else {
      nextParams.set(type, value);
    }
    setSearchParams(nextParams);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await api.createProduct({
        name: newProduct.name,
        category: newProduct.category,
        brand: newProduct.brand,
        price: Number(newProduct.price),
        image: newProduct.image || defaultProductImage,
        description: newProduct.description,
        rating: Number(newProduct.rating)
      });
      setProductsList((prev) => [...prev, created]);
      setNewProduct({
        name: '',
        category: categoriesList[0]?.name || 'Laptops',
        brand: brandsList[0]?.name || '',
        price: '',
        image: '',
        description: '',
        rating: '5'
      });
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add product to the database.');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = useMemo(() => ['all', ...categoriesList.map((category) => category.name)], [categoriesList]);
  const brandOptions = useMemo(() => ['all', ...brandsList.map((brand) => brand.name)], [brandsList]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return productsList.filter((product) => {
      const matchesSearch = !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        (product.brand || '').toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [productsList, searchTerm, selectedCategory, selectedBrand]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 pt-16">
        <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-[#2563EB] animate-pulse">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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

        <FilterGroup
          title="Categories"
          options={categoryOptions}
          selected={selectedCategory}
          onSelect={(value) => updateFilter('category', value)}
        />

        <FilterGroup
          title="Brands"
          options={brandOptions}
          selected={selectedBrand}
          onSelect={(value) => updateFilter('brand', value)}
        />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 mb-8">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </motion.p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={getProductKey(product)} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

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
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">{submitError}</div>
              )}

              <TextInput
                label="Product Name"
                value={newProduct.name}
                onChange={(value) => setNewProduct({ ...newProduct, name: value })}
                required
                placeholder="e.g. iPhone 16 Pro Max"
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectInput
                  label="Category"
                  value={newProduct.category}
                  onChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  options={categoriesList.map((category) => category.name)}
                />
                <SelectInput
                  label="Brand"
                  value={newProduct.brand}
                  onChange={(value) => setNewProduct({ ...newProduct, brand: value })}
                  options={brandsList.map((brand) => brand.name)}
                />
              </div>

              <TextInput
                label="Price ($)"
                type="number"
                min="1"
                value={newProduct.price}
                onChange={(value) => setNewProduct({ ...newProduct, price: value })}
                required
                placeholder="e.g. 999"
              />

              <TextInput
                label="Image URL"
                type="url"
                value={newProduct.image}
                onChange={(value) => setNewProduct({ ...newProduct, image: value })}
                placeholder="https://example.com/image.jpg (optional)"
              />

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

              <TextInput
                label="Rating (1-5)"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={newProduct.rating}
                onChange={(value) => setNewProduct({ ...newProduct, rating: value })}
                required
              />

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

function FilterGroup({
  title,
  options,
  selected,
  onSelect
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: title === 'Categories' ? 0.2 : 0.3 }}
      className="mb-8"
    >
      <h3 className="text-lg font-bold text-[#0F172A] mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(option)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selected === option
                ? 'bg-[#2563EB] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option === 'all' ? 'All' : option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
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
    <div>
      <label className="block text-gray-700 font-semibold mb-1 text-sm">{label}</label>
      <input
        type={type}
        required={required}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-1 text-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#2563EB] focus:outline-none bg-white"
        required
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
        {options.length === 0 && <option value="">No {label.toLowerCase()} created yet</option>}
      </select>
    </div>
  );
}
