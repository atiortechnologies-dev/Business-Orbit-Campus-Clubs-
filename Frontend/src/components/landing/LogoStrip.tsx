const logos = ["Stanford", "MIT", "Harvard", "Y Combinator", "Techstars", "Sequoia", "a16z"];

export default function LogoStrip({ title = "Trusted by leading institutions" }: { title?: string }) {
  return (
    <section className="bg-white py-12 border-y border-black/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <p className="text-center text-xs uppercase tracking-widest text-neutral-500 mb-8">{title}</p>
        <div className="flex flex-wrap items-center justify-around gap-x-10 gap-y-6">
          {logos.map((name) => (
            <span
              key={name}
              className="text-lg lg:text-xl font-black tracking-tight text-neutral-400 hover:text-neutral-700 transition-colors"
              style={{ fontFamily: "serif" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
