import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRegCopyright } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">
              Century<span className="text-[#2563EB]">Tech</span>
            </h3>
            <p className="text-gray-400">
              Premium technology products at affordable prices.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <FaPhone className="text-[#2563EB]" />
                <span>+234 801 234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#2563EB]" />
                <span>info@centurytech.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#2563EB]" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, color: '#2563EB' }}
                href="#"
                className="text-gray-400 text-2xl transition"
              >
                <FaFacebook />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: '#2563EB' }}
                href="#"
                className="text-gray-400 text-2xl transition"
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: '#2563EB' }}
                href="#"
                className="text-gray-400 text-2xl transition"
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: '#2563EB' }}
                href="https://wa.me/YOUR_PHONE_NUMBER"
                className="text-gray-400 text-2xl transition"
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
          <p className="text-center md:text-left flex items-center gap-1">
            <FaRegCopyright aria-hidden="true" />
            <span>{currentYear} CenturyTech. All Rights Reserved.</span>
          </p>
          <Link to="/admin" className="text-gray-500 hover:text-gray-300 transition text-sm">
            Admin Area
          </Link>
        </div>
      </div>
    </footer>
  );
}
