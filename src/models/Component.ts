import mongoose, { Schema, Document } from "mongoose";

export interface IComponent extends Document {
  type: "weather" | "carousel" | "camera" | "static_info";
  imageUrl?: string;
  title?: string;
  content?: string;
  location?: {
    country: string;
    province: string;
  };
  weatherItems?: string[];
}

const componentSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["weather", "carousel", "camera", "static_info"],
    required: true,
  },
  imageUrl: { type: String },
  title: { type: String },
  content: { type: String },
  location: {
    country: { type: String },
    province: { type: String },
  },
  weatherItems: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Component = mongoose.model<IComponent>(
  "Component",
  componentSchema
);
