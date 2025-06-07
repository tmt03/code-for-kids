// src/types/product.ts

export interface Product {
  pid: string;
  pname: string;
  pimg: string;
  pdescription: string;
  pprice: number;
  pquantity: number;
}
export interface OrderFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  question?: string;
  quantity: number;
}