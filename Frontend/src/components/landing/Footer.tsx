import logo from "../../assets/bocc-logo.png";

const cols = [
  {
    title: "Company",
    items: ["About Us", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    items: ["Events", "Stories", "Blog", "Support"],
  },
  {
    title: "Legal",
    items: ["Privacy Policy", "Terms of Service", "Cookie Policy", "FAQ"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14 grid gap-10 lg:grid-cols-4">
        <div>
          <img
            src={logo}
            alt="BOCC Logo"
            className="h-10 w-auto"
          />

          <p className="mt-3 text-sm text-neutral-600 max-w-xs">
            Building the world's largest network for campus-born startups.
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold text-sm">{col.title}</h3>

            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-black transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <span>© 2026 BOCC. All rights reserved.</span>

          <span>Made with ❤️ by BOCC</span>
        </div>
      </div>
    </footer>
  );
}