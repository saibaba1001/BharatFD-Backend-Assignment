import { expect } from 'chai';
import request from 'supertest';
import app from '../src/index.js';

describe('FAQ API', () => {
  let faqId;

  describe('POST /api/faqs', () => {
    it('should create a new FAQ', async () => {
      const res = await request(app)
        .post('/api/faqs')
        .send({
          question: 'What is this test question?',
          answer: 'This is a test answer for the FAQ system.'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      faqId = res.body.id;
    });
  });

  describe('GET /api/faqs', () => {
    it('should return all FAQs in English', async () => {
      const res = await request(app).get('/api/faqs');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return FAQs in Hindi', async () => {
      const res = await request(app).get('/api/faqs?lang=hi');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/faqs/:id', () => {
    it('should return a single FAQ', async () => {
      const res = await request(app).get(`/api/faqs/${faqId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', faqId);
    });
  });
});