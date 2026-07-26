function Objectives() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">

      {/* Learning Objectives */}
      <div className="p-6 border border-outline-variant rounded-lg space-y-4">

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">
            target
          </span>
          <h3 className="font-headline-md text-[20px]">Learning Objectives</h3>
        </div>

        <ul className="space-y-3">

          <li className="flex gap-3 text-body-sm">
            <span className="font-bold text-primary">01.</span>
            <span>
              Master various user acquisition channels and conversion
              optimization techniques.
            </span>
          </li>

          <li className="flex gap-3 text-body-sm">
            <span className="font-bold text-primary">02.</span>
            <span>
              Implement systematic feedback loops to drive product
              iteration.
            </span>
          </li>

          <li className="flex gap-3 text-body-sm">
            <span className="font-bold text-primary">03.</span>
            <span>
              Understand key performance indicators (KPIs) for
              early-stage growth.
            </span>
          </li>

        </ul>

      </div>

      {/* Success Criteria */}
      <div className="p-6 border border-outline-variant rounded-lg space-y-4">

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">
            verified_user
          </span>
          <h3 className="font-headline-md text-[20px]">Success Criteria</h3>
        </div>

        <div className="space-y-3">

          <div className="p-3 bg-surface-container rounded-lg border-l-4 border-primary">
            <p className="text-body-sm font-bold">User Base Growth</p>
            <p className="text-[12px] opacity-70">
              Minimum of 50 active users engaged with the core value
              proposition.
            </p>
          </div>

          <div className="p-3 bg-surface-container rounded-lg border-l-4 border-outline">
            <p className="text-body-sm font-bold">Feedback Saturation</p>
            <p className="text-[12px] opacity-70">
              At least 15 detailed qualitative interviews conducted.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Objectives;