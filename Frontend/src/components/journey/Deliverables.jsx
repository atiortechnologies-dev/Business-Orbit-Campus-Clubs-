const deliverables = [
  {
    id: 1,
    icon: "bar_chart",
    title: "User Acquisition Data",
    description: "CSV or Dashboard export of conversion rates.",
  },
  {
    id: 2,
    icon: "forum",
    title: "Customer Feedback Log",
    description: "Summary of user pain points and suggestions.",
  },
  {
    id: 3,
    icon: "stream_apps",
    title: "Updated Product Version",
    description: "Link to latest build with feedback-driven changes.",
  },
];

function Deliverables() {
  return (
    <section className="border border-outline-variant rounded-lg bg-white overflow-hidden">

      <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-md text-[18px]">Stage Deliverables</h3>
        <span className="bg-primary text-on-primary px-2 py-1 rounded text-[10px] font-bold">
          REQUIRED
        </span>
      </div>

      <div className="divide-y divide-outline-variant">

        {deliverables.map((item) => (
          <div
            key={item.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-surface-container transition-colors group"
          >

            <div className="flex items-center gap-4">

              <div className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">
                  {item.icon}
                </span>
              </div>

              <div>
                <p className="font-bold text-body-md">{item.title}</p>
                <p className="text-body-sm text-on-surface-variant">{item.description}</p>
              </div>

            </div>

            <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
              chevron_right
            </span>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Deliverables;