# Multilingual FAQ API

A robust REST API for managing multilingual FAQs with automatic translation support, caching, and WYSIWYG editor compatibility.

## Features

- 🌐 Multi-language support (English, Hindi, Bengali)
- 🚀 Automatic translation using Google Translate API
- 💾 Redis caching for improved performance
- ✅ Input validation and error handling
- 🔒 Rate limiting and security headers
- 🐳 Docker support
- 🧪 Unit tests

## Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- Google Cloud API credentials

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd faq-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the services:
   ```bash
   # Using Docker
   docker-compose up

   # Or locally
   npm run dev
   ```

## API Endpoints

### Get all FAQs
```http
GET /api/faqs?lang=en
```

Query Parameters:
- `lang`: Language code (en, hi, bn)

### Get FAQ by ID
```http
GET /api/faqs/:id?lang=en
```

### Create FAQ
```http
POST /api/faqs
```
```json
{
  "question": "What is this?",
  "answer": "This is a FAQ system"
}
```

### Update FAQ
```http
PUT /api/faqs/:id
```
```json
{
  "question": "Updated question",
  "answer": "Updated answer"
}
```

### Delete FAQ
```http
DELETE /api/faqs/:id
```

## Testing

Run the test suite:
```bash
npm test
```

## Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Access the API at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT