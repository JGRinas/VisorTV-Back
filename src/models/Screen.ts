import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IScreen extends Document {
  name: string;
  assignedOperators: Types.ObjectId[];
  components: Types.ObjectId[];
}

const screenSchema: Schema = new Schema({
  name: { type: String, required: true },
  assignedOperators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  components: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Screen = mongoose.model<IScreen>('Screen', screenSchema);
