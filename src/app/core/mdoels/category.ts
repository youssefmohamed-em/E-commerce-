export interface Category {
  id: string;
  number: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
}