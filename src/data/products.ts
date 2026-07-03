export interface Product {
  _id?: string;
  id: number;
  name: string;
  category: string;
  brand?: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
}

