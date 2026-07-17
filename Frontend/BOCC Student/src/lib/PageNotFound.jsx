import { useLocation, Link } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg text-center">

        <h1 className="text-8xl font-bold text-slate-300">404</h1>

        <h2 className="mt-4 text-3xl font-semibold text-slate-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-600">
          The page{" "}
          <span className="font-semibold text-slate-800">
            "{pageName}"
          </span>{" "}
          does not exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center mt-8 px-6 py-3 rounded-lg bg-[#C8D400] text-black font-semibold hover:bg-[#b4c100] transition"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
}