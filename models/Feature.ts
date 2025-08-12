import mongoose, { Schema, Document } from 'mongoose';

export interface IFeature extends Document {
  title: string;
  description: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);