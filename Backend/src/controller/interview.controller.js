const { PDFParse } = require("pdf-parse")   // ✅ named export, not a bare function
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const { InterviewReportModel } = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    console.log("req.file:", req.file); // Log the file object to see what is being received
    try {
        const parser = new PDFParse({ data: req.file.buffer })
        const result = await parser.getText()
        const resumeContent = result.text

        const { jobDescription, selfDescription } = req.body
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            jobDescription,
            selfDescription
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        })

        res.status(201).json({
            message: "interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("FULL ERROR:", error)
        res.status(500).json({ message: "something went wrong", error: error.message })
    }
}


async function getInterviewByReportIdController(req,res) {
    const {interviewId} = req.params
    const interviewReport = await InterviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview Report Not Found"
        })
    }

    return res.status(200).json({
        message:"Interview Report Fetched Sucessfully",
        interviewReport
    })
}


async function getAllInterviewReportsController(req,res) {
    const interviewReports = await InterviewReportModel.find({
        user: req.user.id
    }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preprationPlan')

    res.status(200).json({
        message: "All Interview Reports Fetched Successfully",
        interviewReports
    })
}


async function generateResumePdfController(req,res){
    const {interviewReportId} = req.params

    const interviewReport = await InterviewReportModel.findById(interviewReportId)
    if(!interviewReport){
        res.status(404).json({
            message: "Interview Report Not Found"
        })
    }
    const {resume, selfDescription, jobDescription}= interviewReport

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition": `attachment; filename= resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReportController, getInterviewByReportIdController, getAllInterviewReportsController ,generateResumePdfController }