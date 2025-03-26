import { z } from 'zod';

const userSchema = z.object({
   email: z.string().email({ message: 'Provide a valid email' }),
   name: z.string().trim().min(1),
   mobile: z.string().min(1, { message: 'mobile is required' }),  // Add validation for mobile
   address: z.string().min(1, { message: 'Address is required' }),  // Add validation for address
   password: z.string().min(8),
   isAdmin: z.boolean().optional().default(false),
});

export function validateUser(input) {
   return userSchema.safeParse(input);
}
