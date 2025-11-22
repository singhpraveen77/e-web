import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { resetPassword } from "../redux/slices/authSlice";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Button,
} from "../components/ui";

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill email from navigation state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !otp || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(
        resetPassword({ email, otp, password, confirmPassword })
      ).unwrap();

      setMessage(res?.message || "Password reset successful!");
      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to reset password. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center pb-6">
            <CardTitle>Verify OTP & Reset Password</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              )}

              {message && (
                <div className="p-3 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    {message}
                  </p>
                </div>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                type="text"
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
                autoComplete="one-time-code"
              />

              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                showPasswordToggle
              />

              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                showPasswordToggle
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-4 space-y-2">
            <Button
              variant="link"
              onClick={() => navigate("/forgot-password")}
              className="p-0 h-auto font-medium w-full"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Send OTP
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="p-0 h-auto font-medium w-full"
            >
              Back to Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;
