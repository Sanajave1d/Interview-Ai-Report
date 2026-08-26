import { useEffect } from "react";
import {
  Code2,
  MessageSquare,
  Map,
  ChevronDown,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useInterview } from "../hooks/useInterview";
import { useParams } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../Loader";

// ── Sample data (replace with real report data) ────────────────────────────
const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
  { id: "roadmap", label: "Road Map", icon: Map },
];

// let report = null

// ── Sub-components ──────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-slate-800 bg-slate-900">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer w-full text-left"
      >
        <span className="font-mono text-xs text-pink-400 shrink-0">
          Q{index + 1}
        </span>

        <p className="flex-1 text-sm text-slate-200">{item.question}</p>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-slate-800 pt-3">
          <div>
            <span className="inline-block font-mono text-xs tracking-widest text-slate-500 mb-1">
              INTENTION
            </span>

            <p className="text-sm text-slate-400 leading-relaxed">
              {item.intention}
            </p>
          </div>

          <div>
            <span className="inline-block font-mono text-xs tracking-widest text-pink-400 mb-1">
              MODEL ANSWER
            </span>

            <p className="text-sm text-slate-300 leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="rounded-sm border border-slate-800 bg-slate-900 p-4">
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-xs tracking-widest text-pink-400">
        DAY {day.day}
      </span>
      <h3 className="font-serif text-base text-slate-100">{day.focus}</h3>
    </div>
    <ul className="flex flex-col gap-2">
      {day.tasks.map((task, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
          <span className="mt-1.5 w-1 h-1 rounded-full text-pink-400 shrink-0" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Component (UI only — wire up state, hooks, and data fetching) ─────
const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");
  const { interviewId } = useParams();
  const { loading, report, getReportById, getResumePdf } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  if (loading || !report) {
    return (
      <Loader/>
    );
  }

  const scoreColor =
    report.matchScore >= 80
      ? "text-pink-400 text-pink-400"
      : report.matchScore >= 60
        ? "border-slate-400 text-slate-300"
        : "border-slate-600 text-slate-500";

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* ── Left Nav ── */}
        <nav className="md:w-56 shrink-0 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs tracking-widest text-slate-500 mb-3">
              SECTIONS
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              let isActive = activeNav === item.id;
              return (
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    isActive = activeNav === item.id;
                  }}
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-slate-900 text-pink-400 border border-slate-800"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1">
            <button onClick={()=> getResumePdf(interviewId)} className="flex items-center justify-center gap-2 rounded-sm bg-pink-400 px-4 py-3 text-sm font-medium text-slate-950 hover:bg-pink-800 cursor-pointer active:scale-95 transition-all duration-200">
              <Download className="w-4 h-4" />
              Download Resume
            </button>
            <button
              onClick={() => navigate("/")}
              className="hidden lg:flex items-center justify-center gap-2 rounded-sm bg-slate-800 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-700 cursor-pointer active:scale-95 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </nav>

        <div className="hidden md:block w-px bg-slate-800" />

        {/* ── Center Content ── */}
        <main className="flex-1 min-w-0">
          {activeNav === "technical" && (
            <section>
              <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-slate-800">
                <h2 className="font-serif text-2xl text-slate-100">
                  Technical Questions
                </h2>
                <span className="font-mono text-xs text-slate-500">
                  {report.technicalQuestions.length} QUESTIONS
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-slate-800">
                <h2 className="font-serif text-2xl text-slate-100">
                  Behavioral Questions
                </h2>
                <span className="font-mono text-xs text-slate-500">
                  {report.behavioralQuestions.length} QUESTIONS
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-slate-800">
                <h2 className="font-serif text-2xl text-slate-100">
                  Preparation Road Map
                </h2>
                <span className="font-mono text-xs text-slate-500">
                  {report.preprationPlan.length}-DAY PLAN
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.preprationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="hidden md:block w-px bg-slate-800" />

        {/* ── Right Sidebar ── */}
        <aside className="md:w-64 shrink-0 flex flex-col gap-6">
          {/* Match Score */}
          <div className="flex flex-col items-center text-center rounded-sm border border-slate-800 bg-slate-900 p-6">
            <p className="font-mono text-xs tracking-widest text-slate-500 mb-4">
              MATCH SCORE
            </p>
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${scoreColor}`}
            >
              <span className="font-serif text-2xl">{report.matchScore}</span>
              <span className="text-sm">%</span>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Strong match for this role
            </p>
          </div>

          {/* Skill Gaps */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-5">
            <p className="font-mono text-xs tracking-widest text-slate-500 mb-4">
              SKILL GAPS
            </p>
            <div className="flex flex-wrap gap-2">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`font-mono text-xs px-2.5 py-1 rounded-sm border ${
                    gap.severity === "high"
                      ? "text-pink-400 text-pink-400"
                      : gap.severity === "medium"
                        ? "border-slate-500 text-slate-300"
                        : "border-slate-700 text-slate-500"
                  }`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* back to home button */}
        <button
          onClick={() => navigate("/")}
          className="md:hidden flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-xs tracking-widest">
            BACK TO HOME
          </span>
        </button>
      </div>
    </div>
  );
};

export default Interview;
