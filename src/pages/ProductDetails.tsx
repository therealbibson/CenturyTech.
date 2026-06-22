import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCartPlus, FaMinus, FaPlus, FaStar } from 'react-icons/fa';
import type { Product } from '../data/products';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addToCart, getItemQuantity } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError('Product not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await api.getProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-16">
        <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-[#2563EB] animate-pulse">Loading Product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Product unavailable</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not find that product.'}</p>
          <Link to="/products" className="inline-flex items-center gap-2 text-[#2563EB] font-bold hover:underline">
            <FaArrowLeft /> Back to products
          </Link>
        </div>
      </div>
    );
  }

  const currentCartQuantity = getItemQuantity(product.id);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-[#2563EB] font-bold mb-8 hover:underline">
          <FaArrowLeft /> Back to products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
          >
            <img src={product.image} alt={product.name} className="w-full h-[420px] object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-[#2563EB] mb-3">{product.category}</p>
            <h1 className="text-4xl font-bold text-[#0F172A] mb-4">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 0) ? 'text-[#F59E0B]' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} rating</span>
              </div>
            )}

            <p className="text-gray-600 text-lg leading-8 mb-8">{product.description}</p>

            <div className="text-4xl font-bold text-[#2563EB] mb-8">
              NGN {product.price.toLocaleString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-5">
              <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-12 w-12 flex items-center justify-center text-[#0F172A] hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className="h-12 w-16 text-center border-x border-gray-200 font-bold outline-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="h-12 w-12 flex items-center justify-center text-[#0F172A] hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                <FaCartPlus /> {added ? 'Added to Cart' : 'Add to Cart'}
              </motion.button>
            </div>

            {currentCartQuantity > 0 && (
              <p className="text-sm font-semibold text-gray-600">
                You already have {currentCartQuantity} in your cart.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
