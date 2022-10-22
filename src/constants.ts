import { getReviews } from '@/lib/api/user';
export const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const queryKeys = {
  getProduct: 'getProduct',
  getProducts: 'getProducts',
  getPost: 'getPost',
  getPosts: 'getPosts',
  getReviews: 'getReviews',
  getFavorites: 'getFavorites',
  getDeals: 'getDeals',
};
