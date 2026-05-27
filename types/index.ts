export interface MemberVariant {
  name: string;
  number: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: { front?: string; back?: string; detail?: string };
  badges: string[];
  shipping: string;
  category: string;
  member?: string;
  stock: number;
  sizes?: string[];
  description?: string;
  memberVariants?: MemberVariant[];
}

export interface CartItem {
  productId: number;
  quantity: number;
  size: string;
}
