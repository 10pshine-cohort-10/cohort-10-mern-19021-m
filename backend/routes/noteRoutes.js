const express = require('express');
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const validateId = require('../middleware/validateId');
const { createNoteSchema, updateNoteSchema } = require('../validators/noteValidator');

const router = express.Router();

router.use(auth);

router.get('/', noteController.list);
router.post('/', validate(createNoteSchema), noteController.create);
router.get('/:id', validateId, noteController.get);
router.patch('/:id', validateId, validate(updateNoteSchema), noteController.update);
router.delete('/:id', validateId, noteController.remove);

module.exports = router;