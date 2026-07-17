// @ts-nocheck
import FadeIn from "./FadeIn";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div
      className={`flex flex-col ${alignment} max-w-2xl ${
        align === "center" ? "mx-auto" : ""
      }`}
    >
      {eyebrow && (
        <FadeIn>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
            {eyebrow}
          </span>
        </FadeIn>
      )}

      <FadeIn delay={0.05}>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem] md:leading-[1.15] text-balance">
          {title}
        </h2>
      </FadeIn>

      {subtitle && (
        <FadeIn delay={0.1}>
          <p className="mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
}