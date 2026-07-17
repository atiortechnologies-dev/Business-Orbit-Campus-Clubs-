import { Link, useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-bold text-gray-300">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          The page{" "}
          <span className="font-semibold text-black">
            "{pageName}"
          </span>{" "}
          does not exist.
        </p>

        <Link
          to="/"
          className="inline-flex items-center mt-8 rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}