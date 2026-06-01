import { motion } from 'framer-motion';
import type { Product } from '../data/products';
import { FaStar } from 'react-icons/fa';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
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
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2563EB] text-white px-6 py-2 rounded-full font-medium"
          >
            View Details
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#0F172A] mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

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
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-[#2563EB]">
            ₦{product.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
