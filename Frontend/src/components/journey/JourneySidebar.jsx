import { Link } from "react-router-dom";

const stages = [
  { icon: "lightbulb", title: "Ideation", completed: true },
  { icon: "verified", title: "Validation", completed: true },
  { icon: "model_training", title: "Prototype", completed: true },
  { icon: "business_center", title: "Business Model", completed: false },
  { icon: "rocket_launch", title: "Launch", completed: false },
];

function JourneySidebar({ currentStage }) {
  return (
    <aside className="flex flex-col h-full py-8 w-64 border-r border-outline-variant bg-surface shrink-0">

      <div className="px-6 mb-8">
        <h1 className="text-[20px] font-bold text-primary">BOCC Portal</h1>
        <p className="text-body-sm text-on-surface-variant opacity-70">Student Ideation</p>
      </div>

      <nav className="flex-1 space-y-1 px-4">

        {stages.map((stage) => {

          const active = stage.title === currentStage;
          const lockedLook = !stage.completed && !active;

          return (
            <Link
              key={stage.title}
              to="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body-md text-body-md transition-all duration-200
                ${active
                  ? "text-primary font-bold border-r-2 border-primary bg-surface-container"
                  : stage.completed
                  ? "text-on-surface-variant opacity-50 cursor-not-allowed"
                  : "text-on-surface-variant opacity-50 cursor-not-allowed"
                }
              `}
            >

              <span className="material-symbols-outlined">
                {stage.icon}
              </span>

              <span>
                {stage.title}
              </span>

              {stage.completed && !active && (
                <span className="ml-auto material-symbols-outlined text-[16px]">
                  check_circle
                </span>
              )}

            </Link>
          );
        })}

      </nav>

      <div className="mt-auto px-4 space-y-1">

        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer rounded-lg text-on-surface-variant"
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-body-md">Profile</span>
        </Link>

        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer rounded-lg text-on-surface-variant"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md">Logout</span>
        </Link>

      </div>

    </aside>
  );
}

export default JourneySidebar;