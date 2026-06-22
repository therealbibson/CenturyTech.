import { motion } from 'framer-motion';
import { FaBullseye, FaLightbulb, FaHeart, FaStar, FaCheckCircle } from 'react-icons/fa';

export default function About() {
  const values = [
    {
      icon: <FaStar className="text-4xl text-[#F59E0B]" />,
      title: 'Quality',
      description: 'We ensure every product meets our strict quality standards'
    },
    {
      icon: <FaLightbulb className="text-4xl text-[#2563EB]" />,
      title: 'Innovation',
      description: 'Always bringing the latest technology to our customers'
    },
    {
      icon: <FaHeart className="text-4xl text-red-500" />,
      title: 'Integrity',
      description: 'Building trust through honest and transparent practices'
    },
    {
      icon: <FaStar className="text-4xl text-[#2563EB]" />,
      title: 'Customer Satisfaction',
      description: 'Your happiness is our top priority'
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6">
              About <span className="text-[#2563EB]">CenturyTech</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are a trusted technology retailer dedicated to providing premium
              laptops, smartphones, tablets, and accessories at competitive prices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#0F172A] mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              CenturyTech was founded with a simple mission: to make premium
              technology accessible to everyone. We believe that quality tech
              shouldn't break the bank, which is why we partner directly with
              leading manufacturers to offer competitive pricing.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Over the years, we've built a reputation for reliability, integrity,
              and exceptional customer service. Our team of tech enthusiasts is
              always ready to help you find the perfect device for your needs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From students looking for affordable laptops to professionals seeking
              premium devices, CenturyTech is your trusted partner in technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50 p-8 rounded-2xl border-2 border-[#2563EB]"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaBullseye className="text-4xl text-[#2563EB]" />
                <h3 className="text-3xl font-bold text-[#0F172A]">Mission</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide high-quality technology products at competitive prices,
                ensuring our customers have access to the latest gadgets and
                devices from trusted brands with exceptional service.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-amber-50 p-8 rounded-2xl border-2 border-[#F59E0B]"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaLightbulb className="text-4xl text-[#F59E0B]" />
                <h3 className="text-3xl font-bold text-[#0F172A]">Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become the leading technology store known for trust,
                reliability, and customer satisfaction, setting new standards
                in the retail tech industry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
              Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#0F172A] text-center mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#0F172A] mb-4">
              Why Choose CenturyTech?
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                title: 'Genuine Products',
                description: '100% authentic devices from official manufacturers'
              },
              {
                title: 'Competitive Pricing',
                description: 'Best prices in the market without compromising quality'
              },
              {
                title: 'Fast Delivery',
                description: 'Quick and reliable delivery to your doorstep'
              },
              {
                title: 'Warranty Support',
                description: 'Complete warranty and after-sales support'
              },
              {
                title: 'Expert Advice',
                description: 'Knowledgeable staff to help you choose the right device'
              },
              {
                title: '24/7 Customer Service',
                description: 'Available round-the-clock for your queries and concerns'
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 p-6 bg-blue-50 rounded-xl border border-blue-100"
              >
                <FaCheckCircle className="shrink-0 text-[#2563EB] mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
