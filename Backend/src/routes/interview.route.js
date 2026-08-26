const express = require('express')
const { authUser } = require('../middlewares/auth.middleware')
const { upload } = require('../middlewares/file.middleware')
const { generateInterviewReportController, getInterviewByReportIdController, getAllInterviewReportsController, generateResumePdfController } = require('../controller/interview.controller')

const interviewRouter = express.Router()

interviewRouter.post('/', authUser,upload.single('resume'), generateInterviewReportController)
interviewRouter.get('/report/:interviewId', authUser, getInterviewByReportIdController)
interviewRouter.get('/', authUser, getAllInterviewReportsController)
interviewRouter.post('/resume/pdf/:interviewReportId', authUser, generateResumePdfController)

module.exports = {interviewRouter}
