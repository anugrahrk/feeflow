import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ClerkExpressRequireAuth, ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import User, { UserRole } from '../models/User.js';
import Organization from '../models/Organization.js';
import dotenv from 'dotenv';

dotenv.config();

// Extend Express Request to include user info
declare global {
    namespace Express {
        interface Request {
            auth?: any;
            user?: {
                clerkId: string;
                email: string;
                role: UserRole;
                organizationId?: string; // For Admins
            };
        }
    }
}

// 1. Verify Clerk Token
// Using Clerk's middleware directly for simplicity, or we can use custom JWT verification
// validte using clerk SDK
// For now, we assume the user is authenticated via Clerk on frontend and sends a Bearer token
// We will use a custom middleware that decodes the token or uses Clerk's `ClerkExpressRequireAuth` if configured.
// Since configuration might be tricky without keys, we'll create a wrapper.

// 1. Verify Clerk Token

export const verifyToken: RequestHandler = (req, res, next) => {
    console.log("--- Auth Debug Start ---");
    console.log("Request URL:", req.originalUrl);
    console.log("Authorization Header:", req.headers.authorization);

    // Use WithAuth to populate req.auth without strictly requiring it yet
    ClerkExpressWithAuth()(req, res, (err) => {
        if (err) {
            console.error("Clerk Middleware Error:", err);
            return next(err);
        }

        console.log("req.auth after Clerk middleware:", (req as any).auth);

        // Now enforce it manually so we can see the logs first
        if (!(req as any).auth?.userId) {
            console.log("No userId in req.auth - returning 401");
            return res.status(401).json({
                message: "Unauthenticated: No valid Clerk session found",
                debug: "Check server logs for req.auth details"
            });
        }

        next();
    });
};


// 2. Assign Role & Check Database
export const assignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Ensure req.auth exists (populated by Clerk middleware)
        // const clerkId = req.auth.userId; 
        // For now, let's assume we get email/clerkId from the token claims 
        // OR we fetch user details from Clerk API if needed.

        // IMPORTANT: The prompt says "use clerk for login on frontend".
        // We need to know WHO is calling.
        // We'll rely on req.auth.userId from Clerk middleware.

        // MOCKING for development if keys are missing? No, write actual logic.
        // We assume ClerkMiddleware is mounted in index.ts

        const { userId, sessionClaims } = (req as any).auth || {};

        console.log("req.auth:", (req as any).auth);

        if (!userId) {
            console.log("No User ID found in req.auth");
            return res.status(401).json({ message: "Unauthorized: No User ID" });
        }

        // Get email from claims or DB.
        // Simple approach: Check if Super Admin.
        // We need the email to check super admin.
        // sessionClaims usually has email if configured in Clerk.

        // Let's assume we find/create the user in our DB or just check roles.

        // 1. Check Super Admin
        // We might need to fetch the user from Clerk to get the email if not in claims.
        // For this code, I'll assume we can sync/get the user. 
        // Let's rely on our DB `User` model which maps clerkId to Role.

        let user = await User.findOne({ clerkId: userId });
        let role = UserRole.USER;
        let organizationId = undefined;
        let email = ""; // Need to get this.

        if (!user) {
            // If user not in DB, they might be a new user or Super Admin logging in first time?
            // We need to know their email. 
            // We will skip this auto-creation complexity and assume the user exists 
            // OR we return 403 if not found (except for super admin setup).

            // Failsafe: return 403
            // return res.status(403).json({ message: "User not registered in system" });
            // BUT, for Super Admin, we check env.
            // We can't check env without Email. 

            // NOTE: In production, use `clerkClient.users.getUser(userId)` to get email.
            // I will trust the DB has the user.
            return res.status(403).json({ message: "User not found in system" });
        }

        email = user.email;
        role = user.role;

        // Check Super Admin Email Override
        if (email === process.env.SUPER_ADMIN_EMAIL) {
            role = UserRole.SUPER_ADMIN;
        }

        // If Admin, check if Organization is enabled
        if (role === UserRole.ADMIN) {
            const org = await Organization.findOne({ email: email });
            if (!org) {
                return res.status(403).json({ message: "Organization not found" });
            }
            if (!org.isEnabled) {
                return res.status(403).json({ message: "Organization account is disabled" });
            }
            organizationId = org._id.toString();
        }

        req.user = {
            clerkId: userId,
            email: email,
            role: role,
            organizationId: organizationId
        };

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const authorizeRoles = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
        }
        next();
    };
};
