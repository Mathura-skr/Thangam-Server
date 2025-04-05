import { z } from 'zod';

const purchaseSchema = z.object({
   userId: z.number(),
   paymentType: z.enum(['cash', 'paypal', 'credit_card', 'debit_card']),
   comment: z.string().trim().min(1).optional(),
   district: z.boolean().default(true),
   items: z
      .object({
         productId: z.number(),
         quantity: z.number(),
         total: z.number(),
      })
      .array().nonempty(),
});

export function validatePurchase(input) {
   return purchaseSchema.safeParse(input);
}
