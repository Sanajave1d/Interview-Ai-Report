const Loader = ({ label = "Preparing your briefing" }) => {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
      {/* Ring spinner with amber accent, dark track to match theme */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-900 animate-spin" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="font-mono text-xs tracking-widest text-pink-900">
          {label.toUpperCase()}
        </p>
        <LoadingDots />
      </div>
    </main>
  );
};

// Three dots pulsing in sequence, staggered via animation-delay
const LoadingDots = () => (
  <div className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:0ms]" />
    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:150ms]" />
    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-bounce [animation-delay:300ms]" />
  </div>
);

export default Loader;