import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  deadline?: Date;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  status: { 
    type: String, 
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  deadline: { type: Date },
  totalValue: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);