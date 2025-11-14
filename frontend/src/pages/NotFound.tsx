import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgb(var(--bg))]">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-[rgb(var(--fg))] mb-2">404 - Page Not Found</h1>
        <p className="text-[rgb(var(--muted))] mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
