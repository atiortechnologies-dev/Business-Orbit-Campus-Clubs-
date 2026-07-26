import { useEffect, useState } from "react";

function ProgressCard() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(75);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleStartStage = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Traction Stage Started");
    }, 1000);
  };

  return (
    <section className="p-6 border-2 border-primary rounded-lg bg-surface-container-lowest">

      <h4 className="font-label-md text-label-md uppercase mb-4 text-primary-container">
        Next Milestone
      </h4>

      <div className="space-y-4">

        <div className="flex justify-between items-end">
          <span className="font-headline-md">Stage 4: Traction</span>
          <span className="font-label-md text-on-surface-variant">Locked</span>
        </div>

        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <button
          onClick={handleStartStage}
          className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              Start Traction Stage
              <span className="material-symbols-outlined">play_arrow</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-on-surface-variant leading-relaxed">
          By starting this stage, you commit to the deliverables listed.
          The stage duration is approximately 4 weeks.
        </p>

      </div>

    </section>
  );
}

export default ProgressCard;