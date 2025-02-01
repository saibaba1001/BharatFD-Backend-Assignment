import express from 'express';
import { getFaqs, getFaqById, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { validateFaq } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getFaqs);
router.get('/:id', getFaqById);
router.post('/', validateFaq, createFaq);
router.put('/:id', validateFaq, updateFaq);
router.delete('/:id', deleteFaq);

export { router };