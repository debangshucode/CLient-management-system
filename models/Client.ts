import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  projectCount: number;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  address: { type: String },
  projectCount: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);