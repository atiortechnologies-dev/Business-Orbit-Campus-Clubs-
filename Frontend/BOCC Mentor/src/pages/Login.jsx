import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// using native <label> element instead of UI Label to satisfy prop typings
import { LogIn, Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

// Simple Google icon component for the login button
/** @param {import('react').SVGProps<SVGSVGElement>} props */
const GoogleIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path d="M21.6 12.227c0-.687-.062-1.347-.177-1.987H12v3.762h5.4c-.233 1.253-.94 2.317-2.004 3.033v2.52h3.237c1.897-1.747 2.944-4.319 2.944-7.33z" fill="#4285F4"/>
    <path d="M12 22c2.43 0 4.472-.8 5.963-2.17l-3.237-2.52c-.9.605-2.056.964-3.146.964-2.417 0-4.464-1.63-5.195-3.827H3.36v2.404C4.844 19.989 8.159 22 12 22z" fill="#34A853"/>
    <path d="M6.805 14.447A6.996 6.996 0 0 1 6.5 12c0-.827.142-1.623.405-2.347V7.249H3.36A9.996 9.996 0 0 0 2 12c0 1.61.364 3.133 1.003 4.491l2.802-2.044z" fill="#FBBC05"/>
    <path d="M12 6.08c1.32 0 2.507.454 3.44 1.345l2.574-2.574C16.467 3.397 14.426 2.6 12 2.6 8.159 2.6 4.844 4.611 3.36 7.247l3.544 2.405C7.536 7.71 9.583 6.08 12 6.08z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // No backend authentication
    console.log("Email:", email);
    console.log("Password:", password);

    // Redirect to home page
    navigate("/");
  };

  const handleGoogle = () => {
    // No Google authentication
    console.log("Google Login Clicked");

    // Redirect to home page
    navigate("/");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome Back"
      subtitle="Log in to your account"
    >
      <div>
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary font-medium hover:underline"
        >
          Create one
        </Link>
      </div>
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Password</label>

            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 font-medium">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}