import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login as loginapi } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, ShoppingBag, Loader2 } from "lucide-react";
import type { AppDispatch, RootState } from "../redux/store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button } from "../components/ui";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); // Clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await dispatch(loginapi(formData));
      if (res.type.endsWith('/rejected')) {
        setError("Invalid email or password");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={24} />
          <span className="text-[rgb(var(--fg))]">Signing you in...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:relative left-3/8 w-fit bg-[rgb(var(--bg))] flex p-4">
      <div className="w-full  rounded">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">Welcome Back</h1>
          <p className="text-[rgb(var(--muted))] mt-2">Sign in to your ShopEase account</p>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center pb-6">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail size={16} />}
                required
                autoComplete="email"
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock size={16} />}
                showPasswordToggle
                required
                autoComplete="current-password"
              />

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-6">
            <p className="text-sm text-[rgb(var(--muted))] text-center">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/signup")}
                className="p-0 h-auto font-medium"
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>

        {/* Demo credentials info */}
        <Card className="mt-6" padding="sm">
          <CardContent className="text-center">
            <p className="text-xs text-[rgb(var(--muted))]">
              Demo: admin@demo.com / password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
