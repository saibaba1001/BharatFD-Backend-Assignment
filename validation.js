import Joi from 'joi';

const faqSchema = Joi.object({
  question: Joi.string().required().min(10),
  answer: Joi.string().required().min(20)
});

export const validateFaq = (req, res, next) => {
  const { error } = faqSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};