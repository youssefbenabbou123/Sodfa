import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  customerName: string
  phone: string
  city: string
  address: string
  items: IOrderItem[]
  total: number
  status: string
  createdAt?: Date
  updatedAt?: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
}, { _id: false })

const OrderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

// Prevent re-compilation during development
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order

