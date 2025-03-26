import { z } from 'zod';

const querySchema = z.object({
   name: z.string({ invalid_type_error: 'Name must be a string' }).default(''),
   page: z
      .string({ invalid_type_error: 'Page param must be string' })
      .transform(Number)
      .pipe(
         z
            .number({ invalid_type_error: 'Page param must be a number' })
            .int({ message: 'Page param must be an integer' })
      )
      .optional(),
   categoryId: z
      .string()
      .transform(Number)
      .pipe(
         z
            .number({
               invalid_type_error: 'Category ID param must be a number',
            })
            .int({ message: 'Category ID param must be an integer' })
            .min(1)
      )
      .optional(),
   take: z
      .string()
      .transform(Number)
      .pipe(
         z
            .number({ invalid_type_error: 'Take param must be a number' })
            .int({ message: 'Take param must be an integer' })
            .min(5, { message: 'Take param must be greater or equal than 10' })
            .max(50, { message: 'Take must be less or equal than 50' })
            .default(10)
      )
      .optional(),
});

export function validateQuery({ name, page, categoryId, take }) {
   return querySchema.safeParse({ name, page, categoryId, take });
}

export function validatePartialQuery(input) {
   return querySchema.partial().safeParse(input);
}
