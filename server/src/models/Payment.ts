import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    studentId: mongoose.Types.ObjectId;
    organizationId: mongoose.Types.ObjectId;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
