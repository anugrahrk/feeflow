import { Request, Response } from 'express';
import Organization from '../models/Organization.js';

// Create Organization
export const createOrganization = async (req: Request, res: Response) => {
    try {
        const { orgName, ownerName, mobileNumber, email } = req.body;
        console.log(req.role)
        // Check if org with email exists
        const existingOrg = await Organization.findOne({ email });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization with this email already exists' });
        }

        const org = new Organization({
            orgName,
            ownerName,
            mobileNumber,
            email
        });

        await org.save();
        res.status(201).json(org);
    } catch (error) {
        res.status(500).json({ message: 'Error creating organization', error });
    }
};
export const getOrganizationStats = async (req: Request, res: Response) => {
    try {
        const total = await Organization.countDocuments();
        const active = await Organization.countDocuments({ isEnabled: true });
        const disabled = await Organization.countDocuments({ isEnabled: false });

        res.json({ total, active, disabled });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

// Get All Organizations (Paginated & Search)
export const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 5; // Fixed as per requirement
        const search = req.query.search as string || '';

        const query: any = {};
        if (search) {
            query.$or = [
                { orgName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { ownerName: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Organization.countDocuments(query);
        const organizations = await Organization.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            data: organizations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                startIndex: (page - 1) * limit + 1,
                endIndex: Math.min(page * limit, total)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations', error });
    }
};

// Update Organization
export const updateOrganization = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { orgName, ownerName, mobileNumber, email } = req.body;

        const org = await Organization.findByIdAndUpdate(
            id,
            { orgName, ownerName, mobileNumber, email },
            { new: true }
        );

        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(org);
    } catch (error) {
        res.status(500).json({ message: 'Error updating organization', error });
    }
};

// Toggle Status
export const toggleOrganizationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isEnabled } = req.body; // Expect boolean

        const org = await Organization.findByIdAndUpdate(
            id,
            { isEnabled },
            { new: true }
        );

        if (!org) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        res.json(org);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};
