export type PaymentMethod =
  | 'cash_on_delivery'
  | 'credit_card';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface CreateOrderRequest {
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  userId: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;

  paymentProvider?: 'paymob' | 'cashflow' | null;
  paymentReference?: string | null;
  paymentTransactionId?: string | null;

  paymobIntentionId?: string | null;
  paymobOrderId?: number | null;

  cashflowOrderToken?: string | null;
  cashflowOrderId?: number | null;

  subtotal: number;
  shippingCost: number;
  total: number;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayment {
  checkoutUrl: string;
  provider?: 'cashflow' | 'paymob';
  intentionId?: string;
  paymobOrderId?: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    payment: CreateOrderPayment | null;
  };
}

export interface GetOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface GetOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}
 export interface cancelOrderResponse {
  success:boolean,
  message:string,
  data:Order,
 }
