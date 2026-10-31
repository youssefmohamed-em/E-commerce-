import { Product } from "./product";

export interface CartItem {
    productId:number;
    categoryId:string;
    quantity:number;

}

export interface cartResponse{
    items:CartItem[];

}

export interface cartProduct extends CartItem{
    product:Product
}