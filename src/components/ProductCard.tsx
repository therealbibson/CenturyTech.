import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../data/products';
import { FaCartPlus, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, getItemQuantity } = useCart();
  const [added, setAdded] = useState(false);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={`/products/${product.id}`}
              className="bg-[#2563EB] text-white px-6 py-2 rounded-full font-medium"
            >
              View Details
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-bold uppercase text-[#2563EB] mb-1">
          {[product.brand, product.category].filter(Boolean).join(' / ')}
        </p>
        <Link to={`/products/${product.id}`} className="block text-lg font-bold text-[#0F172A] mb-1 hover:text-[#2563EB] transition-colors">
          {product.name}
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating!) ? 'text-[#F59E0B]' : 'text-gray-300'}
                  size={14}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex justify-between items-center gap-3">
          <span className="text-2xl font-bold text-[#2563EB]">
            NGN {product.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 bg-[#F59E0B] text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            <FaCartPlus /> {added ? 'Added' : 'Add'}
          </motion.button>
        </div>

        {cartQuantity > 0 && (
          <p className="text-xs font-semibold text-gray-500 mt-3">
            {cartQuantity} in cart
          </p>
        )}
      </div>
    </motion.div>
  );
}

