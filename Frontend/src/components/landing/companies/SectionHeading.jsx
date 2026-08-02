export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col ${alignment} max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 font-inter text-caption font-medium uppercase tracking-[0.18em] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-neon" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-poppins font-semibold text-3xl sm:text-4xl md:text-[2.75rem] md:leading-[1.15] tracking-tight text-text-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-inter text-body md:text-card leading-relaxed text-text-body">
          {subtitle}
        </p>
      )}
    </div>
  );
}
