import { useState, useRef, useEffect} from "react";
import { Paperclip, ArrowRight, X, FileText } from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import Loader from "../../Loader";

const Home = () => {
  const { loading, generateReport,reports, getReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    getReports();
  }, []);


  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setResumeFile(file || null);
  };

  const clearFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isReady = jobDescription.trim() && selfDescription.trim() && resumeFile;

  const handleGenerateReport = async () => {
    try {
      const resumeFile = fileInputRef.current.files[0];
      console.log("Resume file selected:", resumeFile); // Log the selected file to see if it's being captured
      const data = await generateReport({
        resumeFile,
        jobDescription,
        selfDescription,
      });
      navigate(`/report/${data._id}`);
    } catch (err) {
      console.error("Failed to generate report:", err);
      // show a toast / inline error message here
    }
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between border-b border-slate-800 pb-5">
          <div>
            <p className="font-mono text-xs tracking-widest text-pink-400 mb-2">
              PRE&#8209;INTERVIEW BRIEFING
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-slate-100">
              Build Your Custom Interview Plan
            </h1>
          </div>
          <p className="hidden md:block font-mono text-xs text-slate-500 max-w-xs text-right leading-relaxed">
            Let our Al analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* Dossier */}
        <div className="grid md:grid-cols-5 gap-6 md:gap-8">
          {/* Left: job description as a paper exhibit */}
          <div className="md:col-span-3">
            <div className="bg-stone-100 rounded-sm shadow-2xl shadow-black/40 -rotate-1 md:-rotate-1 h-full min-h-96 flex flex-col">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-300">
                <span className="font-mono text-xs tracking-widest text-stone-500">
                  EXHIBIT A
                </span>
                <span className="font-mono text-xs tracking-widest text-stone-400">
                  JOB DESCRIPTION
                </span>
              </div>
              <textarea
                className="flex-1 w-full resize-none bg-transparent px-5 py-4 text-stone-800 placeholder-stone-400 font-serif text-base leading-relaxed outline-none"
                name="jobDescription"
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. Titles, responsibilities, requirements — the more complete, the sharper the briefing."
              />
            </div>
          </div>

          {/* Right: numbered tabs */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {/* Tab 01: resume */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-pink-400">01</span>
                <label
                  htmlFor="resume"
                  className="font-mono text-xs tracking-widest text-slate-400"
                >
                  RESUME
                </label>
              </div>

              <input
                ref={fileInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />

              {resumeFile ? (
                <div className="flex items-center justify-between gap-3 rounded-sm bg-slate-800 px-3 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="text-sm text-slate-200 truncate">
                      {resumeFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    aria-label="Remove resume"
                    className="text-slate-500 hover:text-slate-200 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-sm border border-dashed border-slate-700 px-3 py-3 text-sm text-slate-400 hover:border-amber-500 hover:text-pink-400 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach PDF
                </button>
              )}
            </div>

            {/* Tab 02: self description */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-pink-400">02</span>
                <label
                  htmlFor="selfDescription"
                  className="font-mono text-xs tracking-widest text-slate-400"
                >
                  ABOUT YOU
                </label>
              </div>
              <textarea
                className="flex-1 w-full min-h-32 resize-none bg-slate-950 rounded-sm border border-slate-800 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500 transition-colors"
                name="selfDescription"
                id="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Strengths, background, what you want the interviewer to remember."
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerateReport}
              type="button"
              disabled={!isReady}
              className="group flex items-center justify-center gap-2 rounded-sm px-5 py-3.5 font-medium text-sm tracking-wide transition-colors
                disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
                bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              Assemble interview report
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Recent Reports List*/}
        {reports.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-slate-100 mb-5">Recent Reports</h2>
            <div className="flex flex-col gap-3">
              {reports.map((report) => (
                <div onClick={()=>navigate(`/report/${report._id}`)} key={report._id} className="bg-slate-800 border cursor-pointer border-slate-600 rounded-sm p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg text-slate-100">{report.title}</h3>
                  <h2 className="text-slate-300 text-sm mb-1">{report.matchScore}% Match</h2>
                  </div>
                  <p className="text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
