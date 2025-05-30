import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// CORS configuration
app.use(cors({
  origin: ['https://prathimaportfolio.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Error handling for JSON parsing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err);
    return res.status(400).json({ 
      error: 'Invalid JSON',
      details: err.message 
    });
  }
  next();
});

// Use routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, askedQuestions = [] } = req.body;
    
    // Your existing chat logic here
    // ...

    res.json({ response: 'Success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    status: 'error'
  });
});

// Log environment variables (safely)
console.log('Environment configuration:', {
  port,
  nodeEnv: process.env.NODE_ENV,
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  openAIKeyLength: process.env.OPENAI_API_KEY?.length,
  openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 3)
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
}); 