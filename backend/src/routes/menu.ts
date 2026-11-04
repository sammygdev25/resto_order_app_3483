import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, requireStaff, AuthRequest } from '../middleware/auth';

const router = Router();

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

const createDishSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().optional().default(''),
  price: z.number().nonnegative(),
  categoryId: z.coerce.number().int().positive(),
  imageUrl: z.string().max(500).optional().default(''),
  isAvailable: z.boolean().optional().default(true),
});

const updateDishSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().max(500).optional(),
  isAvailable: z.boolean().optional(),
});

const dishQuerySchema = z.object({
  category: z.string().optional(),
  available: z.enum(['true', 'false']).optional(),
});

function serializeDish(dish: any) {
  return {
    ...dish,
    price: Number(dish.price),
  };
}

// GET /api/categories/
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories/ (staff only)
router.post('/categories', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.create({
      data: parsed.data,
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:id (signed-in users only)
router.get('/categories/:id', authMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({ where: { id: parsedParams.data.id } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id (staff only)
router.delete('/categories/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({ where: { id: parsedParams.data.id } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await prisma.category.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/dishes/
router.get('/dishes', async (req: Request, res: Response, next: NextFunction) => {
  const parsedQuery = dishQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsedQuery.error.issues });
  }
  try {
    const { category, available } = parsedQuery.data;
    const where: any = {};
    if (category) {
      where.category = { name: { equals: category, mode: 'insensitive' } };
    }
    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }
    const dishes = await prisma.dish.findMany({
      where,
      include: { category: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    });
    res.json(dishes.map(serializeDish));
  } catch (error) {
    next(error);
  }
});

// GET /api/dishes/:id
router.get('/dishes/:id', async (req: Request, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: parsedParams.data.id },
      include: { category: true },
    });
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(serializeDish(dish));
  } catch (error) {
    next(error);
  }
});

// POST /api/dishes/ (staff only)
router.post('/dishes', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsed = createDishSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
    if (!category) {
      return res.status(400).json({ error: 'Category not found', code: 'validation_error' });
    }
    const dish = await prisma.dish.create({
      data: parsed.data,
      include: { category: true },
    });
    res.status(201).json(serializeDish(dish));
  } catch (error) {
    next(error);
  }
});

// PUT /api/dishes/:id (staff only)
router.put('/dishes/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateDishSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.dish.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    if (parsed.data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found', code: 'validation_error' });
      }
    }
    const dish = await prisma.dish.update({
      where: { id: parsedParams.data.id },
      data: parsed.data,
      include: { category: true },
    });
    res.json(serializeDish(dish));
  } catch (error) {
    next(error);
  }
});

// PATCH /api/dishes/:id (staff only) - partial update, used for toggling availability
router.patch('/dishes/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateDishSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.dish.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    if (parsed.data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
      if (!category) {
        return res.status(400).json({ error: 'Category not found', code: 'validation_error' });
      }
    }
    const dish = await prisma.dish.update({
      where: { id: parsedParams.data.id },
      data: parsed.data,
      include: { category: true },
    });
    res.json(serializeDish(dish));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/dishes/:id (staff only)
router.delete('/dishes/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const existing = await prisma.dish.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    await prisma.dish.delete({ where: { id: parsedParams.data.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
