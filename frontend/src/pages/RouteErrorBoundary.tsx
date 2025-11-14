import React from "react";
import { isRouteErrorResponse, useRouteError, Link, useNavigate } from "react-router-dom";

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  let title = "Unexpected Application Error";
  let message = "Something went wrong.";
  let statusCode: number | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    title = `${error.status} ${error.statusText}`;
    message = (error.data && (error.data.message || error.data)) || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const isNotFound = statusCode === 404;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgb(var(--bg))]">
      <div className="w-full max-w-xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[rgb(var(--fg))] mb-2">
          {title}
        </h1>
        {statusCode && (
          <p className="text-sm text-[rgb(var(--muted))] mb-4">Status: {statusCode}</p>
        )}
        <p className="text-[rgb(var(--muted))] mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <Link
            to="/"
            className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Go Home
          </Link>
        </div>

        {import.meta.env.VITE_SHOW_ERROR_DETAILS === 'true' && error && (
          <pre className="mt-8 p-4 text-left text-xs overflow-auto rounded bg-black/5 dark:bg-white/5">
            {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
          </pre>
        )}

        {isNotFound && (
          <p className="mt-4 text-xs text-[rgb(var(--muted))]">
            The page you are looking for doesn't exist.
          </p>
        )}
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
