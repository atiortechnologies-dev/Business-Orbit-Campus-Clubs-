function JourneyTopbar({
  breadcrumb,
  title,
  status,
}) {
  return (
    <header className="flex items-center justify-between px-6 w-full h-16 border-b border-outline-variant bg-surface shrink-0">

      <div className="flex items-center gap-4">

        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {breadcrumb}
        </span>

        <span className="h-4 w-px bg-outline-variant"></span>

        <h2 className="text-[20px] font-bold text-primary">
          {title}
        </h2>

      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-highest rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label-md text-label-md text-primary">
            Status: {status}
          </span>
        </div>

        <button className="material-symbols-outlined p-2 hover:bg-surface-container rounded-full transition-opacity duration-150">
          notifications
        </button>

        <div className="w-8 h-8 rounded-full border border-outline flex items-center justify-center bg-surface-container-high relative">
          <span className="material-symbols-outlined text-[20px]">person</span>
          <div className="absolute inset-0 border border-outline rounded-full diagonal-cross opacity-20"></div>
        </div>

      </div>

    </header>
  );
}

export default JourneyTopbar;