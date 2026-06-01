import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  icon: string;
  index?: number;
}

export default function CategoryCard({ name, icon, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
    >
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="text-5xl mb-4 inline-block"
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-[#0F172A]">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">Explore Collection</p>
      </div>
    </motion.div>
  );
}
