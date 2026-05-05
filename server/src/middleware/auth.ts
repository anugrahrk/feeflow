import { Request, Response, NextFunction } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { User } from '@clerk/backend';
import OrgModel from '../models/Organization.js';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            clerkUser?: User;
            role?: 'super_user' | 'admin' | 'user';
            organizationId?: mongoose.Types.ObjectId;
        }
    }
}

// 1. Verify Token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: 'No valid session found.' });
    }

    try {
        const user = await clerkClient.users.getUser(userId);
        req.clerkUser = user;
        next();
    } catch (error) {
        console.error('Clerk getUser error:', error);
        res.status(401).json({ error: 'Invalid token or user not found.' });
    }
};

// 2. Assign Role
export const assignRole = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.clerkUser) {
        return res.status(500).json({ error: 'User missing from request.' });
    }

    const primaryEmail = req.clerkUser.emailAddresses.find(
        (e) => e.id === req.clerkUser?.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
        return res.status(400).json({ error: 'No primary email on Clerk account.' });
    }

    // Super user check
    if (primaryEmail === process.env.SUPER_USER_EMAIL) {
        req.role = 'super_user';
        return next();
    }

    // DB lookup for admin
    try {
        const dbUser = await OrgModel.findOne({ email: primaryEmail });

        if (dbUser?.isEnabled === false) {
            return res.status(403).json({ error: 'Your account has been disabled.' });
        }

        req.role = dbUser ? 'admin' : 'user';
    } catch (error) {
        console.error('DB error in assignRole:', error);
        req.role = 'user';
    }

    next();
};

// 3. Require Role
export const requireRole = (role: 'super_user' | 'admin' | 'user') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.role === 'super_user') return next();

        if (req.role !== role) {
            return res.status(403).json({ error: `Requires ${role} permissions.` });
        }

        if (req.role === 'admin') {
            const primaryEmail = req.clerkUser?.emailAddresses.find(
                (e) => e.id === req.clerkUser?.primaryEmailAddressId
            )?.emailAddress;

            try {
                const dbUser = await OrgModel.findOne({ email: primaryEmail });
                req.organizationId = dbUser?._id;
            } catch (error) {
                console.error('DB error in requireRole:', error);
                return res.status(500).json({ error: 'Failed to load organization.' });
            }
        }

        next();
    };
};