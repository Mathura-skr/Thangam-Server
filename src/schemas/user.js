const { z } = require("zod");  

function validateUser(input) {
   const userSchema = z.object({
       email: z.string().email({ message: "Provide a valid email" }),
       name: z.string().trim().min(1, { message: "Name is required" }),
       mobile: z.string().min(1, { message: "Mobile is required" }),
       address: z.string().min(1, { message: "Address is required" }),
       password: z.string().min(8, { message: "Password must be at least 8 characters" }),
       isAdmin: z.boolean().optional().default(false),
   });

   return userSchema.safeParse(input);  
}

module.exports = { validateUser };
