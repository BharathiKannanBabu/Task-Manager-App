import { Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const categoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(40),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a valid hex color code').default('#0071e3'),
  icon: z.string().default('Folder'),
});

export const getCategories = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const categories = await Category.find({
      $or: [{ userId }, { isDefault: true, userId: null }],
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = categoryInputSchema.parse(req.body);

    const existing = await Category.findOne({
      userId: req.userId,
      name: { $regex: new RegExp(`^${validated.name.trim()}$`, 'i') },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: 'A category with this name already exists.',
      });
      return;
    }

    const count = await Category.countDocuments({ userId: req.userId });

    const category = await Category.create({
      ...validated,
      userId: req.userId,
      isDefault: false,
      order: count,
    });

    res.status(201).json({
      success: true,
      message: 'Category created',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = categoryInputSchema.partial().parse(req.body);

    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found or cannot be modified' });
      return;
    }

    Object.assign(category, validated);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found or default system categories cannot be deleted',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
