import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
    studentName: string;
    email?: string;
    mobileNumber?: string;
    feeRecurringDate: Date;
    amount: number;
    isEnabled: boolean;
    organizationId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
    studentName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls
    mobileNumber: { type: String },
    feeRecurringDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    isEnabled: { type: Boolean, default: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
