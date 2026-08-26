import { useCallback, useContext } from "react";
import {
  generateInterviewReport,
  generateResumePdf,
  getAllInterviewReports,
  getInterviewById,
} from "../services/interview.api";
import { InterviewContext } from "../Interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an interviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    resumeFile,
    jobDescription,
    selfDescription,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        resumeFile,
        jobDescription,
        selfDescription,
      });
      setReport(response.interviewReport);
      return response.interviewReport; // return the report so Home.jsx gets real data
    } catch (error) {
      console.error(error);
      throw error; // let Home.jsx know it failed
    } finally {
      setLoading(false);
    }
  };

  const getReportById = useCallback(
    async (interviewId) => {
      setLoading(true);
      try {
        const response = await getInterviewById(interviewId);
        setReport(response.interviewReport);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport],
  );

  const getReports = useCallback(async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return response?.interviewReports;
  }, [setLoading, setReports]);

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
