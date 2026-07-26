function StageHero() {
  return (
    <section className="p-8 border border-outline-variant rounded-lg bg-surface-container-lowest">

      <div className="flex flex-col md:flex-row gap-8 items-start">

        <div className="w-full md:w-1/3 aspect-square border-2 border-outline-variant rounded-lg diagonal-cross relative bg-surface-container">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-label-md text-on-surface-variant opacity-40">
              STAGE_VISUAL_04
            </span>
          </div>
        </div>

        <div className="flex-1">

          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
            Stage 4 – Traction
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
            Validate your product in the real world by acquiring users,
            collecting feedback, and continuously improving your solution
            before launch.
          </p>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                schedule
              </span>
              <span className="font-label-md">Est. Completion: 4 Weeks</span>
            </div>

            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">
                checklist
              </span>
              <span className="font-label-md">3 Deliverables Required</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default StageHero;