import { z } from 'zod';

/**
 * Profile Setup Form Validation
 */
export const profileSetupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  licenseNumber: z
    .string()
    .min(1, 'License number is required')
    .regex(/^OCM-\d+$/, 'Invalid license format (e.g., OCM-001)'),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  businessType: z.enum(['Processor', 'Distributor', 'Cultivator']),
  phone: z
    .string()
    .regex(/^\+?1?\d{10,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;

/**
 * Product Form Validation
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  type: z.enum(['Flower', 'Concentrate', 'Edible', 'Tincture', 'Oil', 'Materials']),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  thc: z
    .number()
    .min(0, 'THC must be 0 or greater')
    .max(100, 'THC must be 100 or less')
    .optional()
    .nullable(),
  cbd: z
    .number()
    .min(0, 'CBD must be 0 or greater')
    .max(100, 'CBD must be 100 or less')
    .optional()
    .nullable(),
  quality: z.enum(['INDOOR', 'LIGHT_ASSISTED', 'OUTDOOR']).optional().nullable(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unit: z.enum(['oz', 'gram', 'pound', 'each']),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
  minOrder: z.number().int().min(1, 'Minimum order must be at least 1').optional().nullable(),
  coaUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Search and Filter Validation
 */
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['Flower', 'Concentrate', 'Edible', 'Tincture', 'Oil', 'Materials']).optional(),
  quality: z.enum(['INDOOR', 'LIGHT_ASSISTED', 'OUTDOOR']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minTHC: z.number().min(0).max(100).optional(),
  maxTHC: z.number().min(0).max(100).optional(),
});

/**
 * Contact/Request Access Form Validation
 */
export const contactFormSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, 'License number is required')
    .regex(/^OCM-\d+$/, 'Invalid license format (e.g., OCM-001)'),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  businessType: z.enum(['Processor', 'Distributor', 'Cultivator']),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * User Update Form (Admin)
 */
export const userUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  role: z.enum(['admin', 'employee', 'broker']).optional(),
  approved: z.boolean().optional(),
});

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
