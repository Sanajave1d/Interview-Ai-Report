const mongoose = require('mongoose'); 



const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, "Technical Question is required"]
    },
    intention:{
        type: String,
        required :[true , "intention is required"]
    },
    answer:{
        type: String,
        required: [true , 'answer is required']
    }
},{
    _id:false
})


const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true , "behavioral question need"]
    },
    intention:{
        type: String,
        required : [true , "intention is required"]
    },
    answer:{
        type: String,
        required : [true , 'answer is required']
    }
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true , 'skill is required']
    },
    severity:{
        type: String,
        enum:['low' , 'medium', 'high'],
        required:[true , 'severity is needed']
    }
},{
    _id:false
})



const preprationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required:[true , 'day is required ']
    },
    focus:{
        type: String,
        required: [true , 'focus is required']
    },
    tasks:[{
        type: String,
        required:[true, 'task is required']
    }]
})

const interviewReportSchema= new mongoose.Schema({
    title:{
        type: String,
        required: [true , 'Job title is required'],
        trim: true
    },
    jobDescription:{
        type: String,
        required:[true , 'job description is required']
    },
    resume:{
        type: String
    },
    selfDescription:{
        type: String,
    },
    matchScore:{
        type: Number,
        min:0,
        max:100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preprationPlan: [preprationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})



const InterviewReportModel = mongoose.model("InterviewReport" , interviewReportSchema)

module.exports = {InterviewReportModel}