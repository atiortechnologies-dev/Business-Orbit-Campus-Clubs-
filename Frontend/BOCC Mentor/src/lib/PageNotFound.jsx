import { useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 */}
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-slate-300">404</h1>
          <div className="w-16 h-0.5 bg-slate-200 mx-auto"></div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-800">
            Page Not Found
          </h2>

          <p className="text-slate-600 leading-relaxed">
            The page{" "}
            <span className="font-medium text-slate-700">
              "{pageName || "/"}"
            </span>{" "}
            does not exist.
          </p>
        </div>

        {/* Button */}
        <div className="pt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}