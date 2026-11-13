import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  icon?: string;
  userId?: Types.ObjectId;
  isDefault: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 40,
    },
    color: {
      type: String,
      default: '#0071e3', // Apple Blue default
    },
    icon: {
      type: String,
      default: 'Folder',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true, partialFilterExpression: { userId: { $type: 'objectId' } } });

export const Category = model<ICategory>('Category', categorySchema);
