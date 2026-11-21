const { z } = require('zod');

const emailField = z.string().trim().toLowerCase().max(254).pipe(z.email());

const signupSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: emailField,
  password: z
    .string()
    .min(8)
    .max(72)
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
      message: 'Password must be at most 72 bytes when UTF-8 encoded',
    }),
});

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
});

/** @typedef {import('zod').infer<typeof signupSchema>} SignupInput */
/** @typedef {import('zod').infer<typeof loginSchema>} LoginInput */

module.exports = { signupSchema, loginSchema };