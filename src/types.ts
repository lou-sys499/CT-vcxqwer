export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  category: string;
  tag?: string; // e.g., 'Best Seller', 'Top Rated'
  description: string;
  features: string[]; // Existing
  productHighlights: string[]; // Added
  specs: { [key: string]: string };
  isNew?: boolean;
  popularity?: number;
  discount?: number;
  createdAt: any; // ISO String or Firestore Timestamp
  clickThroughRate: number; // Added
  totalSales: number; // Added
  suction_power_kpa?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}
