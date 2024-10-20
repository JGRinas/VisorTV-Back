import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'operator';
  name: string;
  surname: string;
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operator'], required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
