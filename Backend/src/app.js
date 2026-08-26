const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const cors = require('cors')
const { interviewRouter } = require('./routes/interview.route')


const app = express()
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
}))

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