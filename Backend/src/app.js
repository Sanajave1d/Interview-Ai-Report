const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const cors = require('cors')
const { interviewRouter } = require('./routes/interview.route')


const app = express()
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // keep local dev working
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
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
app.use('/api/auth/',authRouter )
app.use('/api/interview/', interviewRouter)

app.use((error, req, res, next) => {
	if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
		return res.status(400).json({ message: 'request body must contain valid JSON' })
	}

	return next(error)
})

module.exports = app