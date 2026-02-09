import { Request, Response, NextFunction, RequestHandler } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { User } from '@clerk/backend';
import OrgModel from '../models/Organization.js'; // Your Mongoose User model
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


// 1. Verify Token: Checks if the session is valid
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: "No valid session found." });
    }

    try {
        const user = await clerkClient.users.getUser(userId);
        req.clerkUser = user; // Store Clerk user for the next function
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token or user not found." });
    }
};

// 2. Assign Roles: Logic for super_user -> DB lookup -> default user
export const assignRole = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.clerkUser) return res.status(500).send("User missing from request");

    const primaryEmail = req.clerkUser.emailAddresses.find(
        (e) => e.id === req.clerkUser?.primaryEmailAddressId
    )?.emailAddress;

    // A. Check for Super User (Hardcoded)
    if (primaryEmail === "anugrahrk6@gmail.com") {
        req.role = "super_user";
        return next();
    }

    // B. Check Database for Admin or existing User
    try {
        const dbUser = await OrgModel.findOne({ email: primaryEmail });
        if (dbUser?.isEnabled == false) {
            return res.status(403).json({ error: "Your account has been disabled." });
        } else {
            if (dbUser) {
                req.role = "admin";
            }
            else {
                req.role = "user";
            }
        }
    } catch (error) {
        req.role = "user"; // Fallback on DB error
    }
    next();
};

// 3. Authorize: A helper function to lock routes based on the assigned role
export const requireRole = (role: 'super_user' | 'admin' | 'user') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.role === 'super_user') return next(); // Super user bypasses all
        if (req.role !== role) {
            return res.status(403).json({ error: `Requires ${role} permissions.` });
        }
        if (req.role == "admin") {
            const primaryEmail = req?.clerkUser?.emailAddresses.find(
                (e) => e.id === req?.clerkUser?.primaryEmailAddressId
            )?.emailAddress;
            const dbUser = await OrgModel.findOne({ email: primaryEmail });
            req.organizationId = dbUser?._id;
        }
        next();
    };
};

