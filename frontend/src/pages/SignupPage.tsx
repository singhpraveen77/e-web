import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Register as registerApi } from "../api/user.api.js";
import { User, Mail, Lock, Upload, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button } from "../components/ui";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === "profile" && files) {
      setFormData({ ...formData, profile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      if (formData.profile) {
        data.append("avatar", formData.profile);
      }

      const res = await registerApi(data);
      console.log("Signup response:", res);
      
      // Show success and redirect
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." } 
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrors({ 
        submit: error.response?.data?.message || "Signup failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 dark:bg-green-500 rounded-2xl mb-4">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[rgb(var(--fg))]">Create Account</h1>
          <p className="text-[rgb(var(--muted))] mt-2">Join ShopEase today and start shopping</p>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader className="text-center pb-6">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{errors.submit}</p>
                </div>
              )}

              <Input
                type="text"
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User size={16} />}
                error={errors.name}
                required
                autoComplete="name"
              />

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail size={16} />}
                error={errors.email}
                required
                autoComplete="email"
              />

              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock size={16} />}
                showPasswordToggle
                error={errors.password}
                helperText="Must be at least 6 characters"
                required
                autoComplete="new-password"
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock size={16} />}
                showPasswordToggle
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[rgb(var(--fg))]">Profile Image (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    id="profile"
                    name="profile"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center gap-3 p-3 border border-[rgb(var(--border))] rounded-lg bg-[rgb(var(--card))] hover:bg-[rgb(var(--bg))] transition-base">
                    <Upload size={16} className="text-[rgb(var(--muted))]" />
                    <span className="text-sm text-[rgb(var(--fg))]">
                      {formData.profile ? formData.profile.name : "Choose profile image"}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="success"
                className="w-full" 
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-6">
            <p className="text-sm text-[rgb(var(--muted))] text-center">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="p-0 h-auto font-medium"
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </Card>

        {/* Terms */}
        <Card className="mt-6" padding="sm">
          <CardContent className="text-center">
            <p className="text-xs text-[rgb(var(--muted))]">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
