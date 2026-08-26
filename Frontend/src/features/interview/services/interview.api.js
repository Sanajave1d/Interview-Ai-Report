import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})


export const generateInterviewReport = async (payload) => {
    const formData = new FormData();
    formData.append("resume", payload.resumeFile);
    formData.append("jobDescription", payload.jobDescription);
    formData.append("selfDescription", payload.selfDescription);

    const response = await api.post("/api/interview/", formData);
    return response.data;
};


export const getInterviewById = async (interviewId)=>{
    const response= await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}


export const getAllInterviewReports = async ()=>{
    const response = await api.get('/api/interview')
    return response.data
}

export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      {},
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    if (error.response?.data instanceof Blob) {
      const message = await error.response.data.text();
      try {
        error.response.data = JSON.parse(message);
      } catch {
        error.response.data = { message };
      }
    }
    throw error;
  }
};