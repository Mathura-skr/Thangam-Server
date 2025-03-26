import { z } from 'zod';

const productSchema = z.object({
   name: z
      .string({
         invalid_type_error: 'Product name must be a string',
         required_error: 'Product name is required ',
      })
      .trim()
      .min(1, { message: 'Product name cannot be a empty string' }),
   categoryId: z.number({ required_error: 'Category ID is required' }).int(),
   price: z.number(),
   stock: z.number().int(),
   description: z.string().optional(),
   barCode: z.string().max(150).optional(),
   imgUrl: z.string().url({ message: 'Image must be a valid URL' }),
});

export function validateProduct(input) {
   return productSchema.safeParse(input);
}

export function validatePartialProduct(input) {
   return productSchema.partial().safeParse(input);
}
