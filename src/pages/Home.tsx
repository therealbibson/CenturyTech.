import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaShieldAlt, FaHeadset, FaQuoteLeft, FaStar, FaUserCircle } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { type Product } from '../data/products';
import { api, type Category, type Brand, type Testimonial } from '../services/api';
import DynamicFaIcon from '../components/DynamicFaIcon';

export default function Home() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories, fetchedBrands, fetchedTestimonials] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands(),
          api.getTestimonials()
        ]);
        setProductsList(fetchedProducts);
        setCategoriesList(fetchedCategories);
        setBrandsList(fetchedBrands);
        setTestimonialsList(fetchedTestimonials);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProducts = productsList.slice(0, 6);

  const features = [
    {
      icon: <FaCheckCircle className="text-3xl text-[#2563EB]" />,
      title: 'Genuine Products',
      description: 'All products are 100% authentic from trusted brands'
    },
    {
      icon: <FaTruck className="text-3xl text-[#2563EB]" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your location'
    },
    {
      icon: <FaShieldAlt className="text-3xl text-[#2563EB]" />,
      title: 'Warranty Support',
      description: 'Complete warranty and after-sales support'
    },
    {
      icon: <FaHeadset className="text-3xl text-[#2563EB]" />,
      title: 'Customer Service',
      description: 'Available 24/7 for any questions or concerns'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 pt-16">
        <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-[#2563EB] animate-pulse">
          Loading Home...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-slate-50 flex items-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6 leading-tight"
            >
              Premium Laptops & Smartphones at{' '}
              <span className="text-[#2563EB]">
                Affordable Prices
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 mb-8"
            >
              CenturyTech provides the latest laptops, iPhones, smartphones, tablets, and accessories from trusted brands.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/products"
                  className="bg-[#2563EB] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors"
                >
                  Shop Collection
                </Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="border-2 border-[#0F172A] text-[#0F172A] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#0F172A] hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=500&fit=crop"
                alt="Premium Tech"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Featured Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore our wide range of premium tech products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesList.map((cat, idx) => (
              <CategoryCard
                key={cat.id || cat._id}
                name={cat.name}
                icon={cat.icon}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Popular choices from our customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product._id || product.id} product={product} index={idx} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose CenturyTech */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Why Choose CenturyTech?
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to providing the best service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:border-[#2563EB] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Brands We Sell
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {brandsList.map((brand, idx) => (
              <motion.div
                key={brand._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center h-28"
              >
                <div className="mb-2">
                  <DynamicFaIcon name={brand.logo} size={36} className="text-[#2563EB]" />
                </div>
                <p className="font-semibold text-[#0F172A] text-center text-sm">
                  {brand.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonialsList.map((testimonial, idx) => (
              <motion.div
                key={testimonial._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-blue-50 p-8 rounded-2xl border border-blue-100"
              >
                <div className="flex text-[#F59E0B] gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <FaQuoteLeft className="text-[#2563EB] mb-3" aria-hidden="true" />
                <p className="text-gray-600 mb-4 italic">{testimonial.text}</p>
                <p className="font-bold text-[#0F172A] flex items-center gap-2">
                  <FaUserCircle className="text-[#2563EB]" aria-hidden="true" />
                  <span>{testimonial.name}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2563EB] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Need a New Laptop or Smartphone?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get in touch with us today and find the perfect tech for your needs
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contact"
                className="inline-block bg-[#F59E0B] text-[#0F172A] px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-500 transition-colors"
              >
                Contact CenturyTech
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
