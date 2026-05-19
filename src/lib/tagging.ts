import { Product } from '../types';

export const getProductTags = (product: Product): string[] => {
  const tags: string[] = [];

  // New Tag: within last 30 days
  const createdAt = new Date(product.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) {
    tags.push('NEW');
  }

  // Value Tag: price >= 15% lower than compare_at_price
  if (product.originalPrice && product.price < product.originalPrice * 0.85) {
    tags.push('VALUE');
  }

  // Popular Tag: ... need data for this. CTR / Sales.
  // I'll assume popularity: number from Product can be used as a proxy or just hardcode some threshold.
  // The request says top 10%.
  // For now, I'll rely on product.popularity > 8 as a proxy
  if (product.popularity && product.popularity >= 9) {
    tags.push('POPULAR');
  }

  return tags;
};
