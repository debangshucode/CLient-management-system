import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteFeature {
  featureId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  basePrice: number;
  customPrice?: number;
  quantity: number;
}

export interface IQuote extends Document {
  clientId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  quoteNumber: string;
  features: IQuoteFeature[];
  subtotal: number;
  tax?: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteFeatureSchema = new Schema<IQuoteFeature>({
  featureId: { type: Schema.Types.ObjectId, ref: 'Feature', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  customPrice: { type: Number },
  quantity: { type: Number, default: 1 },
});

const QuoteSchema = new Schema<IQuote>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  quoteNumber: { type: String, required: true, unique: true },
  features: [QuoteFeatureSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  },
  validUntil: { type: Date },
  notes: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);