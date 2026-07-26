const roadmap = [
  { id: 1, title: "Ideation", date: "Completed Sep 12", status: "completed" },
  { id: 2, title: "Validation", date: "Completed Oct 05", status: "completed" },
  { id: 3, title: "Prototype", date: "Completed Nov 20", status: "completed" },
  { id: 4, title: "Traction", date: "Current Stage", status: "current" },
  { id: 5, title: "Launch", date: "Locked", status: "locked" },
];

const iconStyles = {
  completed: "bg-primary text-on-primary",
  current: "border-2 border-primary bg-white text-primary",
  locked: "bg-surface-container text-on-surface-variant opacity-40",
};

const textStyles = {
  completed: "",
  current: "text-primary font-bold italic",
  locked: "opacity-40",
};

function Roadmap() {
  return (
    <section className="p-6 border border-outline-variant rounded-lg bg-white">

      <h3 className="font-headline-md text-[18px] mb-6">Program Roadmap</h3>

      <div className="relative space-y-8">

        {roadmap.map((stage, index) => {

          const isLast = index === roadmap.length - 1;

          return (
            <div key={stage.id} className="flex gap-4 relative">

              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 bottom-[-24px] w-px bg-outline-variant
                    ${stage.status === "current" ? "border-dashed" : ""}
                  `}
                ></div>
              )}

              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${iconStyles[stage.status]}`}
              >

                {stage.status === "completed" && (
                  <span className="material-symbols-outlined text-[18px]">check</span>
                )}

                {stage.status === "current" && (
                  <span className="material-symbols-outlined text-[18px]">ads_click</span>
                )}

                {stage.status === "locked" && (
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                )}

              </div>

              <div>

                <p className={`font-bold text-body-md ${stage.status === "locked" ? "opacity-40" : ""}`}>
                  {stage.title}
                </p>

                <p className={`text-body-sm ${stage.status === "completed" ? "opacity-60" : textStyles[stage.status]}`}>
                  {stage.date}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Roadmap;