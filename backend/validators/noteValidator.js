const { z } = require('zod');

const title = z.string().trim().min(1, 'Title is required').max(100);
const content = z.string().max(100000);

const createNoteSchema = z.object({
  title,
  content: content.default(''),
});

const updateNoteSchema = z
  .object({ title, content })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/** @typedef {import('zod').infer<typeof createNoteSchema>} CreateNoteInput */
/** @typedef {import('zod').infer<typeof updateNoteSchema>} UpdateNoteInput */
/** @typedef {import('zod').infer<typeof listQuerySchema>} ListNotesQuery */

module.exports = { createNoteSchema, updateNoteSchema, listQuerySchema };