import pool from '../config/database.js';
import { translateText } from '../services/translate.js';
import { cacheService } from '../services/cache.js';

export const getFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;
    
    //try try to get from cache first
    const cachedFaqs = await cacheService.get(cacheKey);
    if (cachedFaqs) {
      return res.json(JSON.parse(cachedFaqs));
    }

    let query = 'SELECT * FROM faqs';
    const { rows } = await pool.query(query);

    // transform data based on language
    const transformedFaqs = rows.map(faq => ({
      id: faq.id,
      question: lang === 'en' ? faq.question : 
                lang === 'hi' ? faq.question_hi : 
                lang === 'bn' ? faq.question_bn : faq.question,
      answer: lang === 'en' ? faq.answer :
              lang === 'hi' ? faq.answer_hi :
              lang === 'bn' ? faq.answer_bn : faq.answer
    }));

    // cache the results
    await cacheService.set(cacheKey, JSON.stringify(transformedFaqs), 'EX', 3600);

    res.json(transformedFaqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || 'en';
    const cacheKey = `faq:${id}:${lang}`;

    const cachedFaq = await cacheService.get(cacheKey);
    if (cachedFaq) {
      return res.json(JSON.parse(cachedFaq));
    }

    const { rows } = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const faq = rows[0];
    const transformedFaq = {
      id: faq.id,
      question: lang === 'en' ? faq.question :
                lang === 'hi' ? faq.question_hi :
                lang === 'bn' ? faq.question_bn : faq.question,
      answer: lang === 'en' ? faq.answer :
              lang === 'hi' ? faq.answer_hi :
              lang === 'bn' ? faq.answer_bn : faq.answer
    };

    await cacheService.set(cacheKey, JSON.stringify(transformedFaq), 'EX', 3600);

    res.json(transformedFaq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // translate to supported languages
    const questionHi = await translateText(question, 'hi');
    const questionBn = await translateText(question, 'bn');
    const answerHi = await translateText(answer, 'hi');
    const answerBn = await translateText(answer, 'bn');

    const { rows } = await pool.query(
      `INSERT INTO faqs 
       (question, answer, question_hi, answer_hi, question_bn, answer_bn) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [question, answer, questionHi, answerHi, questionBn, answerBn]
    );

    // clear cache
    await cacheService.del('faqs:en');
    await cacheService.del('faqs:hi');
    await cacheService.del('faqs:bn');

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const questionHi = await translateText(question, 'hi');
    const questionBn = await translateText(question, 'bn');
    const answerHi = await translateText(answer, 'hi');
    const answerBn = await translateText(answer, 'bn');

    const { rows } = await pool.query(
      `UPDATE faqs 
       SET question = $1, answer = $2, 
           question_hi = $3, answer_hi = $4,
           question_bn = $5, answer_bn = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [question, answer, questionHi, answerHi, questionBn, answerBn, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    // clear cache
    await cacheService.del(`faq:${id}:en`);
    await cacheService.del(`faq:${id}:hi`);
    await cacheService.del(`faq:${id}:bn`);
    await cacheService.del('faqs:en');
    await cacheService.del('faqs:hi');
    await cacheService.del('faqs:bn');

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM faqs WHERE id = $1 RETURNING *', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    // cclear cache
    await cacheService.del(`faq:${id}:en`);
    await cacheService.del(`faq:${id}:hi`);
    await cacheService.del(`faq:${id}:bn`);
    await cacheService.del('faqs:en');
    await cacheService.del('faqs:hi');
    await cacheService.del('faqs:bn');

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};