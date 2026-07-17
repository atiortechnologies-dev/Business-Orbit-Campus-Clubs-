import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (/** @type {{ preventDefault: () => void; }} */ e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Replace this with your backend API later.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log({
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    alert("Google Sign-In is not configured yet.");
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create Your Account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log In
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            or
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 text-red-600 p-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <Label>Email</Label>

          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-12"
              value={email}
              onChange={(/** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label>Password</Label>

          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12"
              value={password}
              onChange={(/** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label>Confirm Password</Label>

          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12"
              value={confirmPassword}
              onChange={(/** @type {{ target: { value: React.SetStateAction<string>; }; }} */ e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}