import { Product, Category } from './types';
import dewaltNailerImage from './assets/images/dewalt_nailer_1779206204397.png';

export const CATEGORIES: Category[] = [
  {
    id: 'cordless-vacuums',
    name: 'Cordless Vacuums',
    slug: 'cordless-vacuums',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    description: 'Expert reviews of the best cordless stick, upright, and specialized vacuums.'
  },
  {
    id: 'power-tools',
    name: 'Power Tools',
    slug: 'power-tools',
    image: dewaltNailerImage,
    description: 'Cordless nailers, saws, and specialized power tools for the modern workshop.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'dewalt-cordless-nailer',
    name: 'DEWALT 20V MAX XR Cordless Nailer',
    brand: 'DeWalt',
    price: 399.00,
    rating: 4.8,
    reviewsCount: 342,
    images: [dewaltNailerImage],
    category: 'power-tools',
    description: 'The premium DeWalt cordless nailer is an essential cordless power tool for any professional. Whether you need a heavy-duty framing nailer for construction or a precise finish nailer for detailed trim work, this tool delivers outstanding performance without the hassle of hoses. It features a high-efficiency brushless motor that extends its lifespan and runtime. Powered by a robust lithium-ion battery, it seamlessly integrates with the versatile 20V battery platform. As part of the flagship XR series, it guarantees top-tier power and reliability for all your framing and fastening needs.',
    features: ['High-efficiency brushless motor', 'Integrated lithium-ion battery technology', 'Part of the XR series battery platform'],
    productHighlights: ['No compressor needed', 'Fast firing speed', 'Excellent depth adjustment'],
    specs: { 'Power Source': 'Battery', 'Voltage': '20V MAX' },
    createdAt: new Date().toISOString(),
    clickThroughRate: 5.2,
    totalSales: 1540,
    inStock: true
  },
  {
    id: 'cordless-vacuum-cleaner',
    name: 'Pro-Series Cordless Vacuum Cleaner',
    brand: 'Pro-Clean',
    price: 299.99,
    rating: 4.7,
    reviewsCount: 890,
    images: ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'],
    category: 'cordless-vacuums',
    description: 'Discover the ultimate cleaning companion with our premier cordless vacuum cleaner. Designed as a versatile stick vacuum, it is incredibly lightweight and easy to maneuver around any space. It delivers exceptional suction power, effortlessly picking up embedded dirt and stubborn pet hair. Equipped with an advanced HEPA filter, it traps microscopic dust and allergens for a healthier breathing environment. Enjoy extended cleaning sessions thanks to an impressive battery runtime, making it the perfect choice for deep-cleaning carpets and flawlessly maintaining hardwood floors.',
    features: ['Advanced HEPA filter', 'High suction power', 'Long battery runtime', 'Lightweight stick vacuum design'],
    productHighlights: ['Ideal for pet hair', 'Safe on hardwood floors', 'Exceptional suction'],
    specs: { 'Weight': '5.5 lbs', 'Filter Type': 'HEPA' },
    createdAt: new Date().toISOString(),
    clickThroughRate: 6.8,
    totalSales: 3200,
    suction_power_kpa: 25,
    inStock: true
  }
];
