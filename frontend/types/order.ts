export type OrderPayload = {
  role: 'guest';
  products: {
    pid: string;
    pname: string;
    pprice: number;
    quantity: number;
  }[];
  total: number;
  buyer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  createdBy: string;
};

export interface OrderData {
  orderCode: string;
  role: 'guest' | 'user';
  products: {
    pid: string;
    pname: string;
    pprice: number;
    quantity: number;
  }[];
  total: number;
  buyer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note?: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'done';
  createdBy: string;
}
