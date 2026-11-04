/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  orders?: Order[];
  reservations?: Reservation[];
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  isActive?: boolean;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  phone: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  orders: z.array(z.custom<Order>((v) => typeof v === 'object' && v !== null)).optional(),
  reservations: z.array(z.custom<Reservation>((v) => typeof v === 'object' && v !== null)).optional(),
  username: z.string().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
}).passthrough();

// ── Category ──
export interface Category {
  id: number;
  name: string;
  createdAt: string;
  dishs?: Dish[];
  updatedAt?: string;
}

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  createdAt: z.string(),
  dishs: z.array(z.custom<Dish>((v) => typeof v === 'object' && v !== null)).optional(),
  updatedAt: z.string().optional(),
}).passthrough();

// ── Dish ──
export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: Category;
  categoryId: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

export const DishSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  category: z.custom<Category>((v) => typeof v === 'object' && v !== null).optional(),
  categoryId: z.coerce.number().int(),
  imageUrl: z.string(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  orderItems: z.array(z.custom<OrderItem>((v) => typeof v === 'object' && v !== null)).optional(),
}).passthrough();

// ── Order ──
export interface Order {
  id: number;
  user?: User;
  userId: number;
  orderType: string;
  deliveryAddress: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  deliveryFee: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  paidAt?: string | null;
  stripeSessionId?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  notes?: string | null;
}

export const OrderSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  orderType: z.string(),
  deliveryAddress: z.string().nullable(),
  status: z.string(),
  paymentStatus: z.string(),
  totalAmount: z.coerce.number(),
  deliveryFee: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(z.custom<OrderItem>((v) => typeof v === 'object' && v !== null)).optional(),
  paidAt: z.string().nullable().optional(),
  stripeSessionId: z.string().nullable().optional(),
  contactName: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
}).passthrough();

// ── OrderItem ──
export interface OrderItem {
  id: number;
  order?: Order;
  orderId: number;
  dish?: Dish;
  dishId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt?: string;
}

export const OrderItemSchema = z.object({
  id: z.coerce.number(),
  order: z.custom<Order>((v) => typeof v === 'object' && v !== null).optional(),
  orderId: z.coerce.number().int(),
  dish: z.custom<Dish>((v) => typeof v === 'object' && v !== null).optional(),
  dishId: z.coerce.number().int(),
  quantity: z.coerce.number().int(),
  price: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
}).passthrough();

// ── Reservation ──
export interface Reservation {
  id: number;
  user?: User;
  userId: number;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  status: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export const ReservationSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  partySize: z.coerce.number().int(),
  reservationDate: z.string(),
  reservationTime: z.string(),
  status: z.string(),
  specialRequests: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

