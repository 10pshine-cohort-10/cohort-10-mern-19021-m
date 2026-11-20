const { z } = require('zod');

const emailField = z.string().trim().toLowerCase().max(254).pipe(z.email());

const signupSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: emailField,
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
});

module.exports = { signupSchema, loginSchema };