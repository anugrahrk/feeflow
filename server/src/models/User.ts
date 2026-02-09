import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    USER = 'user'
}

export interface IUser extends Document {
    email: string;
    clerkId: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    clerkId: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
