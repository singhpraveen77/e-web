import React, { useState } from "react";

// Contact Page with developer details loaded from environment variables
// Fully Vite-compatible + Dark mode

const DEVELOPERS = [
  {
    id: import.meta.env.VITE_DEV1_ID || "dev-1",
    name: import.meta.env.VITE_DEV1_NAME || "PRAVEEN SINGH",
    role: import.meta.env.VITE_DEV1_ROLE || "Full-stack Engineer",
    email: import.meta.env.VITE_DEV1_EMAIL || "singhpraveen8893@gmail.com",
    phone: import.meta.env.VITE_DEV1_PHONE || "+91 9536159505",
    github: import.meta.env.VITE_DEV1_GITHUB || "https://github.com/singhpraveen77",
    linkedin:
      import.meta.env.VITE_DEV1_LINKEDIN ||
      "https://www.linkedin.com/in/praveen-singh-004539286/",
    bio:
      import.meta.env.VITE_DEV1_BIO ||
      "Leads frontend - backend integrations and prefers to work more on functionality.",
  },
];

export default function ContactPage(): React.ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Name is required.");
    if (!email.trim()) errs.push("Email is required.");
    else if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email))
      errs.push("Invalid email format.");
    if (!message.trim()) errs.push("Message cannot be empty.");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(null);
    const errs = validate();
    if (errs.length) return setErrors(errs);

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess("Your message has been sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrors(["Failed to send message. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full px-6 lg:px-16 py-12 text-gray-100 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-white">Contact Us</h1>
          <p className="mt-2 text-gray-400 text-lg">
            Get in touch with our team — we’ll get back to you shortly.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <section className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-medium mb-4 text-white">Send a Message</h2>

            {errors.length > 0 && (
              <div className="mb-4 rounded-md border border-red-400 bg-red-900/40 p-3 text-sm text-red-300">
                <strong className="block font-medium">Please fix the following:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-md border border-green-400 bg-green-900/40 p-3 text-sm text-green-300">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    disabled={submitting}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-300">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  disabled={submitting}
                  placeholder="Your message..."
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>

          {/* Developer Info */}
          <aside className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-medium text-white mb-4">Developers</h3>
              <ul className="space-y-4">
                {DEVELOPERS.map((dev) => (
                  <li key={dev.id} className="flex gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-700 text-white font-semibold">
                      {dev.name.split(" ").map((n:any) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-white">{dev.name}</p>
                      <p className="text-sm text-gray-400">{dev.role}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${dev.email}`}
                          className="text-indigo-400 hover:underline"
                        >
                          {dev.email}
                        </a>
                      </p>
                      {dev.phone && (
                        <p className="text-sm text-gray-400">
                          <strong>Phone:</strong> {dev.phone}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        {dev.github && (
                          <a
                            href={dev.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs border border-gray-600 rounded px-2 py-1 hover:border-indigo-400"
                          >
                            GitHub
                          </a>
                        )}
                        {dev.linkedin && (
                          <a
                            href={dev.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs border border-gray-600 rounded px-2 py-1 hover:border-indigo-400"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-sm text-gray-400">
              <p>
                <strong>Office:</strong>{" "}
                {import.meta.env.VITE_OFFICE_ADDRESS ||
                  "12/3 Commerce Street, Bengaluru"}
              </p>
              <p className="mt-2">
                Business hours:{" "}
                {import.meta.env.VITE_BUSINESS_HOURS ||
                  "Mon–Fri, 9:30 AM – 6:00 PM IST"}
              </p>
            </div>
          </aside>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()}{" "}
          {import.meta.env.VITE_SITE_NAME || "Example Store"} — Built by the dev
          team.
        </footer>
      </div>
    </main>
  );
}
