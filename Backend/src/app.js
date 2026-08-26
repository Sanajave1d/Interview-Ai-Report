const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const cors = require('cors')
const { interviewRouter } = require('./routes/interview.route')


const app = express()
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && url.hostname.startsWith('interview-ai-report-') && url.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.set("trust proxy", 1);

app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.json({
        message: 'Interview AI API is running'
    })
})
app.use('/api/auth/',authRouter )
app.use('/api/interview/', interviewRouter)

app.use((error, req, res, next) => {
	if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
		return res.status(400).json({ message: 'request body must contain valid JSON' })
	}

  console.error('Request failed:', error)
  return res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app