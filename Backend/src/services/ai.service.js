const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer")
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  title: z
    .string()
    .min(1)
    .describe("The job title from the job description."),
  matchScore: z
    .number()
    .describe(
      "A number between 0 and 100 indicating the match score between the candidate's resume and the job description.",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked during the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The interviewer intention or thought process behind their asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, including the key points that should be covered in the answer and what approaches or methods should be used to solve the problem.",
          ),
      }),
    )
    .describe(
      "The technical questions that can be asked during the interview, along with the interviewer intention and how to answer them.",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked during the interview.",
          ),
        intention: z
          .string()
          .describe(
            "The interviewer intention or thought process behind their asking this question.",
          ),
        answer: z
          .string()
          .describe(
            "How to answer this question, including the key points that should be covered in the answer and what approaches or methods should be used to solve the problem.",
          ),
      }),
    )
    .describe(
      "The behavioral questions that can be asked during the interview, along with the interviewer's intention and how to answer them.",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking or needs to improve upon.",
          ),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of the skill gap, indicating how critical it is for the candidate to improve upon this skill.",
          ),
      }),
    )
    .describe(
      "The skill gaps that the candidate has, along with the severity of each gap.",
    ),
  preprationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe(
            "The day number in the preparation plan, strating from 1 and increasing sequentially.",
          ),
        focus: z
          .string()
          .describe(
            "The main focus or topic of the preparation plan for that day.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "The specific tasks or activities that the candidate should complete on that day to improve their skills and prepare for the interview.",
          ),
      }),
    )
    .describe(
      "The preparation plan for the candidate, outlining the focus and tasks for each day leading up to the interview.",
    ),
});

async function generateInterviewReport({resume = "", jobDescription = "", selfDescription = "",}) {
    const prompt = `You are an expert in evaluating candidates for job interviews. Your task is to generate a comprehensive interview report based on the provided candidate information.

    Resume:
    ${resume || "Not provided"}

    Job Description:
    ${jobDescription || "Not provided"}

    Self Description:
    ${selfDescription || "Not provided"}

    Generate a valid JSON object with the following structure:
    - matchScore: number between 0 and 100
    - title: the job title from the job description
    - technicalQuestions: generate exactly 5 objects, each with question, intention, answer
    - behavioralQuestions: generate exactly 4 objects, each with question, intention, answer
    - skillGaps: array of objects with skill and severity
    - preprationPlan: array of objects with day, focus, tasks

    Return only valid JSON, no markdown fences, and ensure the schema matches the requested data model.`;

  try {
    const schema =z.toJSONSchema(interviewReportSchema);
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    

    const responseText =
      response?.text ||
      response?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("") ||
      "{}";

    const parsedResponse = interviewReportSchema.parse(JSON.parse(responseText));
    console.log("response from AI:", parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("AI report generation failed:", error);
    throw error;
  }
}


async function generateResumePdf({resume,selfDescription,jobDescription}) {
  const resumePdfSchema = z.object({
    html:z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")

  })

  const prompt = `Generate a resume in HTML format based on the following information:
  Resume: ${resume || "Not provided"}
  Self Description: ${selfDescription || "Not provided"}
  Job Description: ${jobDescription || "Not provided"}
  The resume should be a JSON object with a single key "html" containing the HTML content of the resume. The HTML should be well-structured and formatted, suitable for conversion to PDF. Return only valid JSON, no markdown fences, and ensure the schema matches the requested data model. The resume should be tailored to the job description and highlight the candidate's strengths and relevant experience. The content of resume should be not sound like its generated by AI And should be close to human-written. You can highlight the content using some colors or different font styles. The resume should be visually appealing and easy to read. The content should be ATS friendly. i.e It should be easily parsable by ATS system`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const JSONcontent= JSON.parse(response.text)
  const pdfBuffer = await generateResumeFromHtml(JSONcontent.html)

  return pdfBuffer
}


async function generateResumeFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = {
  generateInterviewReport,
  generateResumePdf
};
