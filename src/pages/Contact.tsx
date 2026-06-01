import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-3xl text-[#2563EB]" />,
      title: 'Phone',
      value: '+234 801 234 5678',
      link: 'tel:+2348012345678'
    },
    {
      icon: <FaEnvelope className="text-3xl text-[#2563EB]" />,
      title: 'Email',
      value: 'info@centurytech.com',
      link: 'mailto:info@centurytech.com'
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl text-[#2563EB]" />,
      title: 'Address',
      value: 'Lagos, Nigeria',
      link: '#'
    },
    {
      icon: <FaWhatsapp className="text-3xl text-green-500" />,
      title: 'WhatsApp',
      value: '+234 801 234 5678',
      link: 'https://wa.me/2348012345678'
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, idx) => (
              <motion.a
                key={idx}
                href={info.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-blue-100"
              >
                <div className="flex justify-center mb-4">{info.icon}</div>
                <h3 className="text-lg font-bold text-[#0F172A] text-center mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-center font-medium">
                  {info.value}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#0F172A] mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2563EB] outline-none text-lg"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2563EB] outline-none text-lg"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2563EB] outline-none text-lg"
                  placeholder="+234 801 234 5678"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2563EB] outline-none text-lg resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors"
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </motion.button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-600 text-center font-semibold"
                >
                  Thank you! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Map & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Map Embed */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.829859154827!2d3.3575916!3d6.6271137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf51cd8a50001%3A0x8b8b8b8b8b8b8b8b!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">Monday - Friday:</span> 9:00 AM
                  - 6:00 PM
                </p>
                <p>
                  <span className="font-semibold">Saturday:</span> 10:00 AM -
                  4:00 PM
                </p>
                <p>
                  <span className="font-semibold">Sunday:</span> Closed
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  24/7 Online Support Available
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'What is your return policy?',
                a: 'We offer a 7-day return policy for all products in original condition with all packaging and documentation.'
              },
              {
                q: 'Do you offer warranty on products?',
                a: 'Yes, all products come with manufacturer warranty. Additional warranty plans are also available.'
              },
              {
                q: 'How long does delivery take?',
                a: 'Standard delivery takes 2-3 business days. Express delivery options are available for urgent orders.'
              },
              {
                q: 'Are all products genuine?',
                a: '100% genuine products. We source directly from official distributors and manufacturers.'
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-all"
              >
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
