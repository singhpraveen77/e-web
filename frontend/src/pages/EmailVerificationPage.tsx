import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button } from "../components/ui";

const EmailVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      setStatus("error");
      setMessage("Email and OTP are required.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const res = await axiosInstance.post("/user/email/verify", {
        email,
        otp,
      });

      setStatus("success");
      setMessage(res.data?.message || "Email verified successfully. You can now log in.");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Email verified successfully. Please log in." },
        });
      }, 2000);
    } catch (error: any) {
      setStatus("error");
      const data = error?.response?.data;
      const serverMessage = typeof data === "string" ? data : data?.message;
      setMessage(serverMessage || "Verification failed. Please check the OTP and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center pb-4">
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Enter the OTP sent to your email to complete registration.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="text"
                name="otp"
                label="OTP"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              {message && (
                <div
                  className={`p-3 rounded-lg border text-sm text-center ${
                    status === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                      : status === "error"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                      : "bg-[rgb(var(--card))] border-[rgb(var(--border))] text-[rgb(var(--fg))]"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={status === "loading"}
                disabled={status === "loading"}
              >
                Verify & Continue
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-4">
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="p-0 h-auto font-medium"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
