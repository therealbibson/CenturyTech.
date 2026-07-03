import { type Product } from '../data/products';

export interface Category {
  _id?: string;
  id: number;
  name: string;
  icon: string;
}

export interface Brand {
  _id?: string;
  name: string;
  logo: string;
}

export interface Testimonial {
  _id?: string;
  name: string;
  text: string;
  rating: number;
  approved?: boolean;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'pay_on_delivery' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'new' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderInput {
  customer: Order['customer'];
  items: OrderItem[];
  paymentMethod: Order['paymentMethod'];
}

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

export type ProductInput = Omit<Product, '_id' | 'id'> & { brand?: string; image?: string | File };
export type CategoryInput = Omit<Category, '_id' | 'id'> & { id?: number; icon?: string | File };
export type BrandInput = Omit<Brand, '_id'> & { logo?: string | File };
export type TestimonialInput = Omit<Testimonial, '_id'>;

async function parseError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

function adminHeaders() {
  const token = localStorage.getItem('ct_token') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  async getProducts(category?: string, search?: string, brand?: string): Promise<Product[]> {
    const url = new URL(`${API_BASE_URL}/products`);
    if (category && category !== 'all') {
      url.searchParams.append('category', category);
    }
    if (brand && brand !== 'all') {
      url.searchParams.append('brand', brand);
    }
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch products: ${response.statusText}`));
    }
    return response.json();
  },

  async getProductById(id: number | string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch product: ${response.statusText}`));
    }
    return response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch categories: ${response.statusText}`));
    }
    return response.json();
  },

  async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${API_BASE_URL}/brands`);
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch brands: ${response.statusText}`));
    }
    return response.json();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch testimonials: ${response.statusText}`));
    }
    return response.json();
  },

  async createProduct(productData: ProductInput): Promise<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('price', String(productData.price));
    formData.append('description', productData.description);
    formData.append('rating', String(productData.rating || 0));
    if (productData.brand) {
      formData.append('brand', productData.brand);
    }
    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    } else if (productData.image) {
      formData.append('image', productData.image);
    }

    const token = localStorage.getItem('ct_token') || '';
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to create product: ${response.statusText}`));
    }
    return response.json();
  },

  async createCategory(categoryData: CategoryInput): Promise<Category> {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    if (categoryData.icon instanceof File) {
      formData.append('icon', categoryData.icon);
    } else if (categoryData.icon) {
      formData.append('icon', categoryData.icon);
    }
    if (categoryData.id) {
      formData.append('id', String(categoryData.id));
    }

    const token = localStorage.getItem('ct_token') || '';
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to create category: ${response.statusText}`));
    }
    return response.json();
  },

  async updateCategory(id: string, categoryData: Partial<CategoryInput>): Promise<Category> {
    const formData = new FormData();
    if (categoryData.name != null) {
      formData.append('name', categoryData.name);
    }
    if (categoryData.icon instanceof File) {
      formData.append('icon', categoryData.icon);
    } else if (categoryData.icon) {
      formData.append('icon', categoryData.icon);
    }
    if (categoryData.id != null) {
      formData.append('id', String(categoryData.id));
    }

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('ct_token') || '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update category: ${response.statusText}`));
    }
    return response.json();
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to delete category: ${response.statusText}`));
    }
    return response.json();
  },

  async createBrand(brandData: BrandInput): Promise<Brand> {
    const formData = new FormData();
    formData.append('name', brandData.name);
    if (brandData.logo instanceof File) {
      formData.append('logo', brandData.logo);
    } else if (brandData.logo) {
      formData.append('logo', brandData.logo);
    }

    const token = localStorage.getItem('ct_token') || '';
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to create brand: ${response.statusText}`));
    }
    return response.json();
  },

  async updateBrand(id: string, brandData: Partial<BrandInput>): Promise<Brand> {
    const formData = new FormData();
    if (brandData.name != null) {
      formData.append('name', brandData.name);
    }
    if (brandData.logo instanceof File) {
      formData.append('logo', brandData.logo);
    } else if (brandData.logo) {
      formData.append('logo', brandData.logo);
    }

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('ct_token') || '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update brand: ${response.statusText}`));
    }
    return response.json();
  },

  async deleteBrand(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to delete brand: ${response.statusText}`));
    }
    return response.json();
  },

  async createTestimonial(testimonialData: TestimonialInput): Promise<Testimonial> {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testimonialData)
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to create testimonial: ${response.statusText}`));
    }
    return response.json();
  },

  async getTestimonialsAdmin(): Promise<Testimonial[]> {
    const response = await fetch(`${API_BASE_URL}/testimonials/admin`, {
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch admin testimonials: ${response.statusText}`));
    }
    return response.json();
  },

  async approveTestimonial(id: string, approved: boolean): Promise<Testimonial> {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ approved })
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update testimonial: ${response.statusText}`));
    }
    return response.json();
  },

  async deleteTestimonial(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to delete testimonial: ${response.statusText}`));
    }
    return response.json();
  },

  async getDeliveryFee(): Promise<{ deliveryFee: number }> {
    const response = await fetch(`${API_BASE_URL}/settings/delivery-fee`);
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch delivery fee: ${response.statusText}`));
    }
    return response.json();
  },

  async updateDeliveryFee(deliveryFee: number): Promise<{ deliveryFee: number }> {
    const response = await fetch(`${API_BASE_URL}/settings/delivery-fee`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ deliveryFee })
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update delivery fee: ${response.statusText}`));
    }
    return response.json();
  },

  async createOrder(orderData: OrderInput): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to submit order: ${response.statusText}`));
    }
    return response.json();
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to fetch orders: ${response.statusText}`));
    }
    return response.json();
  },

  async updateOrder(id: string, orderData: Partial<Pick<Order, 'orderStatus' | 'paymentStatus'>>): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: adminHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update order: ${response.statusText}`));
    }
    return response.json();
  },
  async verifyAdmin(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/admin/verify`, {
      method: 'GET',
      headers: adminHeaders()
    });
    return response.ok;
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to delete product: ${response.statusText}`));
    }
    return response.json();
  },

  async updateProduct(id: number, productData: Partial<ProductInput>): Promise<Product> {
    const formData = new FormData();
    if (productData.name != null) formData.append('name', productData.name);
    if (productData.category != null) formData.append('category', productData.category);
    if (productData.brand != null) formData.append('brand', productData.brand);
    if (productData.price != null) formData.append('price', String(productData.price));
    if (productData.description != null) formData.append('description', productData.description);
    if (productData.rating != null) formData.append('rating', String(productData.rating));
    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    } else if (productData.image != null) {
      formData.append('image', productData.image);
    }

    const headers: Record<string, string> = {};
    const token = localStorage.getItem('ct_token') || '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers,
      body: formData
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to update product: ${response.statusText}`));
    }
    return response.json();
  },

  async login(email: string, password: string): Promise<{ token: string; user: { username: string; email: string; role: string } }> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to login: ${response.statusText}`));
    }
    return response.json();
  },

  async signup(username: string, email: string, password: string): Promise<{ token: string; user: { username: string; email: string; role: string } }> {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
      throw new Error(await parseError(response, `Failed to signup: ${response.statusText}`));
    }
    return response.json();
  }
};

