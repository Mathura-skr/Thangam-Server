const { z } = require("zod");

function validateUser(input) {
  const userSchema = z.object({
    email: z.string().email({ message: "Provide a valid email" }),
    name: z.string().trim().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone No is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    isAdmin: z.boolean().optional().default(false),
    role: z.enum(['user', 'admin', 'staff']).optional().default('user'),
  });

  return userSchema.safeParse(input);
}

module.exports = { validateUser };
