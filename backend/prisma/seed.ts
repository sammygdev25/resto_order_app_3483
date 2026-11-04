import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // The admin account, with its own password (SEED_ADMIN_PASSWORD in backend/.env); without it there is none.
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || '';
  if (adminPassword) {
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash(adminPassword, 10),
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin',
      },
    });
  }

  // Domain seed data
  const ids: Record<string, number[]> = {};
  const pick = (list: number[] | undefined, n: number): number => (list && list.length ? list[(n - 1) % list.length] : n);
  ids.User = (await prisma.user.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  try {
    await prisma.category.create({ data: { name: 'Appetizers' } });
    await prisma.category.create({ data: { name: 'Soups & Salads' } });
    await prisma.category.create({ data: { name: 'Pasta' } });
    await prisma.category.create({ data: { name: 'Pizza' } });
    ids.Category = (await prisma.category.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Category skipped:', e); }
  try {
    await prisma.dish.create({ data: { name: 'Crispy Calamari', description: 'Lightly fried squid rings served with a tangy marinara dipping sauce.', price: 8.50, categoryId: pick(ids.Category, 1), imageUrl: '/img/dishes/crispy-calamari.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Caesar Salad', description: 'Crisp romaine, shaved parmesan, croutons tossed in classic Caesar dressing.', price: 12.00, categoryId: pick(ids.Category, 2), imageUrl: '/img/dishes/caesar-salad.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Fettuccine Alfredo', description: 'Fresh fettuccine noodles in a creamy parmesan butter sauce.', price: 9.75, categoryId: pick(ids.Category, 3), imageUrl: '/img/dishes/fettuccine-alfredo.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Margherita Pizza', description: 'Wood-fired pizza with San Marzano tomatoes, mozzarella, and fresh basil.', price: 14.50, categoryId: pick(ids.Category, 4), imageUrl: '/img/dishes/margherita-pizza.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Grilled Ribeye Steak', description: '12oz ribeye grilled to order, served with garlic herb butter.', price: 6.25, categoryId: pick(ids.Category, 5), imageUrl: '/img/dishes/grilled-ribeye-steak.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Pan-Seared Salmon', description: 'Atlantic salmon seared crisp, finished with a lemon butter sauce.', price: 11.00, categoryId: pick(ids.Category, 6), imageUrl: '/img/dishes/pan-seared-salmon.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Tiramisu', description: 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with cocoa.', price: 15.75, categoryId: pick(ids.Category, 7), imageUrl: '/img/dishes/tiramisu.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Fresh Lemonade', description: 'House-made lemonade with fresh squeezed lemons and mint.', price: 7.50, categoryId: pick(ids.Category, 8), imageUrl: '/img/dishes/fresh-lemonade.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Garlic Mashed Potatoes', description: 'Creamy Yukon gold potatoes whipped with roasted garlic and butter.', price: 13.25, categoryId: pick(ids.Category, 9), imageUrl: '/img/dishes/garlic-mashed-potatoes.jpg', isAvailable: true } });
    await prisma.dish.create({ data: { name: 'Belgian Waffle', description: 'Golden waffle topped with whipped cream, berries, and maple syrup.', price: 10.00, categoryId: pick(ids.Category, 10), imageUrl: '/img/dishes/belgian-waffle.jpg', isAvailable: true } });
    ids.Dish = (await prisma.dish.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Dish skipped:', e); }
  try {
    await prisma.order.create({ data: { userId: pick(ids.User, 1), orderType: 'delivery', deliveryAddress: '482 Maple Street, Apt 3B, Springfield', status: 'pending', paymentStatus: 'pending', totalAmount: 24.50, deliveryFee: 8.50, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 2), orderType: 'dine-in', deliveryAddress: 'Table 14', status: 'confirmed', paymentStatus: 'paid', totalAmount: 38.00, deliveryFee: 12.00, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 3), orderType: 'takeout', deliveryAddress: 'Pickup at front counter', status: 'preparing', paymentStatus: 'failed', totalAmount: 17.25, deliveryFee: 9.75, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 4), orderType: 'delivery 4', deliveryAddress: '1209 Oakwood Avenue, Unit 7, Riverside', status: 'out_for_delivery', paymentStatus: 'pending', totalAmount: 52.75, deliveryFee: 14.50, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 5), orderType: 'dine-in 5', deliveryAddress: 'Table 2', status: 'completed', paymentStatus: 'paid', totalAmount: 29.00, deliveryFee: 6.25, paidAt: new Date() } });
    await prisma.order.create({ data: { userId: pick(ids.User, 6), orderType: 'delivery 6', deliveryAddress: '77 Birchwood Lane, Lakeside Heights', status: 'cancelled', paymentStatus: 'failed', totalAmount: 44.50, deliveryFee: 11.00, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 7), orderType: 'takeout 7', deliveryAddress: 'Pickup at side entrance', status: 'pending', paymentStatus: 'pending', totalAmount: 21.75, deliveryFee: 15.75, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 8), orderType: 'delivery 8', deliveryAddress: '350 Elm Court, Suite 12, Downtown', status: 'confirmed', paymentStatus: 'paid', totalAmount: 33.00, deliveryFee: 7.50, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 9), orderType: 'dine-in 9', deliveryAddress: 'Table 9', status: 'preparing', paymentStatus: 'failed', totalAmount: 61.25, deliveryFee: 13.25, paidAt: null } });
    await prisma.order.create({ data: { userId: pick(ids.User, 10), orderType: 'delivery 10', deliveryAddress: '95 Harbor View Drive, Bayport', status: 'out_for_delivery', paymentStatus: 'pending', totalAmount: 26.50, deliveryFee: 10.00, paidAt: null } });
    ids.Order = (await prisma.order.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Order skipped:', e); }
  try {
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 1), dishId: pick(ids.Dish, 1), quantity: 1, price: 8.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 2), dishId: pick(ids.Dish, 2), quantity: 2, price: 12.00 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 3), dishId: pick(ids.Dish, 3), quantity: 3, price: 9.75 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 4), dishId: pick(ids.Dish, 4), quantity: 4, price: 14.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 5), dishId: pick(ids.Dish, 5), quantity: 1, price: 6.25 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 6), dishId: pick(ids.Dish, 6), quantity: 2, price: 11.00 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 7), dishId: pick(ids.Dish, 7), quantity: 3, price: 15.75 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 8), dishId: pick(ids.Dish, 8), quantity: 4, price: 7.50 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 9), dishId: pick(ids.Dish, 9), quantity: 1, price: 13.25 } });
    await prisma.orderItem.create({ data: { orderId: pick(ids.Order, 10), dishId: pick(ids.Dish, 10), quantity: 2, price: 10.00 } });
    ids.OrderItem = (await prisma.orderItem.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] OrderItem skipped:', e); }
  try {
    await prisma.reservation.create({ data: { userId: pick(ids.User, 1), partySize: 1, reservationDate: new Date(), reservationTime: '18:00', status: 'pending', specialRequests: 'Celebrating a 10th wedding anniversary, would love a window seat.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 2), partySize: 2, reservationDate: new Date(), reservationTime: '19:00', status: 'confirmed', specialRequests: 'One guest has a severe peanut allergy.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 3), partySize: 3, reservationDate: new Date(), reservationTime: '20:00', status: 'cancelled', specialRequests: 'High chair needed for a toddler.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 4), partySize: 4, reservationDate: new Date(), reservationTime: '21:00', status: 'pending', specialRequests: 'Requesting a quiet corner table for a business meeting.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 5), partySize: 5, reservationDate: new Date(), reservationTime: '17:00', status: 'confirmed', specialRequests: 'Surprise birthday dinner, please bring a candle with dessert.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 6), partySize: 6, reservationDate: new Date(), reservationTime: '18:00', status: 'cancelled', specialRequests: 'Wheelchair accessible table required.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 7), partySize: 7, reservationDate: new Date(), reservationTime: '19:00', status: 'pending', specialRequests: 'Celebrating a graduation, would like balloons if possible.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 8), partySize: 8, reservationDate: new Date(), reservationTime: '20:00', status: 'confirmed', specialRequests: 'Vegetarian menu options needed for two guests.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 9), partySize: 9, reservationDate: new Date(), reservationTime: '21:00', status: 'cancelled', specialRequests: 'Please seat near the fireplace if available.' } });
    await prisma.reservation.create({ data: { userId: pick(ids.User, 10), partySize: 10, reservationDate: new Date(), reservationTime: '17:00', status: 'pending', specialRequests: 'Anniversary dinner, requesting a bottle of champagne on arrival.' } });
    ids.Reservation = (await prisma.reservation.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map((r) => r.id);
  } catch (e) { console.warn('[seed] Reservation skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
