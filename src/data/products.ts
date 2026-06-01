export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
}

export const products: Product[] = [
  // Laptops
  {
    id: 1,
    name: 'MacBook Pro 16',
    category: 'MacBook',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    description: 'Powerful M3 Max chip with stunning Retina display',
    rating: 4.9
  },
  {
    id: 2,
    name: 'HP EliteBook 850 G10',
    category: 'HP',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1588872657840-4a76c7ab91d4?w=400&h=300&fit=crop',
    description: 'Business-class performance and security features',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Dell XPS 15',
    category: 'Dell',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
    description: 'Ultra-thin design with powerful Intel processors',
    rating: 4.8
  },
  {
    id: 4,
    name: 'Lenovo ThinkPad X1',
    category: 'Lenovo',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1588872657840-4a76c7ab91d4?w=400&h=300&fit=crop',
    description: 'Legendary keyboard and reliable performance',
    rating: 4.6
  },
  {
    id: 5,
    name: 'ASUS VivoBook Pro',
    category: 'Asus',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    description: 'Vibrant display with creative tools included',
    rating: 4.5
  },
  {
    id: 6,
    name: 'Acer Swift 5',
    category: 'Acer',
    price: 999,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
    description: 'Lightweight and speedy with all-day battery',
    rating: 4.4
  },

  // Smartphones
  {
    id: 7,
    name: 'iPhone 16 Pro',
    category: 'iPhone',
    price: 999,
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=300&fit=crop',
    description: 'Advanced camera system with A18 Pro chip',
    rating: 4.9
  },
  {
    id: 8,
    name: 'iPhone 16',
    category: 'iPhone',
    price: 799,
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=300&fit=crop',
    description: 'Innovative camera features at great value',
    rating: 4.8
  },
  {
    id: 9,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Samsung',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop',
    description: 'Brilliant 120Hz display with S Pen included',
    rating: 4.8
  },
  {
    id: 10,
    name: 'Samsung Galaxy S24',
    category: 'Samsung',
    price: 799,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop',
    description: 'Flagship features with 50MP main camera',
    rating: 4.7
  },
  {
    id: 11,
    name: 'Xiaomi 14',
    category: 'Xiaomi',
    price: 599,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop',
    description: 'Premium build with exceptional camera quality',
    rating: 4.6
  },
  {
    id: 12,
    name: 'Tecno Spark 30 Pro',
    category: 'Tecno',
    price: 349,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop',
    description: 'Great performance at affordable price',
    rating: 4.4
  },
  {
    id: 13,
    name: 'Infinix Note 40 Pro',
    category: 'Infinix',
    price: 399,
    image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop',
    description: '120Hz display with fast charging',
    rating: 4.5
  },

  // Tablets
  {
    id: 14,
    name: 'iPad Pro 12.9"',
    category: 'iPad',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1585864299869-592a1dff5211?w=400&h=300&fit=crop',
    description: 'Perfect for creators with M2 chip',
    rating: 4.9
  },
  {
    id: 15,
    name: 'Samsung Galaxy Tab S10',
    category: 'Galaxy Tab',
    price: 899,
    image: 'https://images.unsplash.com/photo-1585864299869-592a1dff5211?w=400&h=300&fit=crop',
    description: 'Beautiful 11" OLED display',
    rating: 4.7
  },

  // Accessories
  {
    id: 16,
    name: 'Apple AirPods Pro',
    category: 'Earbuds',
    price: 249,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=300&fit=crop',
    description: 'Active noise cancellation and spatial audio',
    rating: 4.8
  },
  {
    id: 17,
    name: 'Samsung Fast Charger',
    category: 'Chargers',
    price: 49,
    image: 'https://images.unsplash.com/photo-1589492477223-5d7e4ca20d87?w=400&h=300&fit=crop',
    description: '65W fast charging for all devices',
    rating: 4.6
  },
  {
    id: 18,
    name: 'Anker PowerBank 30W',
    category: 'Power Banks',
    price: 79,
    image: 'https://images.unsplash.com/photo-1589492477223-5d7e4ca20d87?w=400&h=300&fit=crop',
    description: 'Compact and powerful portable battery',
    rating: 4.7
  },

  // Smart Watches
  {
    id: 19,
    name: 'Apple Watch Series 10',
    category: 'Smart Watches',
    price: 399,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Always-On Retina display with fitness tracking',
    rating: 4.8
  },
  {
    id: 20,
    name: 'Samsung Galaxy Watch 7',
    category: 'Smart Watches',
    price: 299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    description: 'Round display with health monitoring',
    rating: 4.6
  }
];

export const categories = [
  { id: 1, name: 'Laptops', icon: '💻' },
  { id: 2, name: 'iPhones', icon: '📱' },
  { id: 3, name: 'Android Phones', icon: '📱' },
  { id: 4, name: 'Tablets', icon: '📑' },
  { id: 5, name: 'Smart Watches', icon: '⌚' },
  { id: 6, name: 'Accessories', icon: '🎧' }
];

export const brands = [
  { name: 'Apple', logo: '🍎' },
  { name: 'HP', logo: '🏢' },
  { name: 'Dell', logo: '🖥️' },
  { name: 'Lenovo', logo: '💼' },
  { name: 'Samsung', logo: '📱' },
  { name: 'Asus', logo: '⚙️' },
  { name: 'Acer', logo: '🌳' },
  { name: 'Xiaomi', logo: '🔴' }
];

export const testimonials = [
  {
    name: 'Ahmed Hassan',
    text: 'CenturyTech provided excellent service and the MacBook Pro I purchased is genuine. Highly recommended!',
    rating: 5
  },
  {
    name: 'Zainab Malik',
    text: 'Fast delivery and competitive prices. My Samsung phone arrived in perfect condition. Great experience!',
    rating: 5
  },
  {
    name: 'Ibrahim Khan',
    text: 'The warranty support is fantastic. Had an issue with my laptop and they resolved it quickly.',
    rating: 5
  },
  {
    name: 'Fatima Ali',
    text: 'Trusted the store with my electronics purchase. CenturyTech never disappoints!',
    rating: 5
  }
];
