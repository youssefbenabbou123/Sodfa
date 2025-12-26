import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  price: number
  image: string
  images?: string[]
  rating: number
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent re-compilation during development
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product

