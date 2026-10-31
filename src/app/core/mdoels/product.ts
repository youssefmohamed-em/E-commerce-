export interface Product {
  id:number
  name: string;
  category: string;
  categoryType: string;
  image: string;
  price: number;
  description: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
}