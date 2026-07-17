import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// use native label element instead of UI Label component to avoid prop type mismatch

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log({
      email,
      password,
    });

    setSuccess(true);
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Frontend Demo"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      {success ? (
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">
            Registration Successful 🎉
          </h3>

          <p className="text-muted-foreground">
            This is only the frontend.
            <br />
            Connect Firebase or your backend later.
          </p>

          <Button asChild className="w-full mt-4">
            <Link to="/login">Go to Login</Link>
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  id="password"
                  type="password"
                  className="pl-10 h-12"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-muted-foreground">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  id="confirm-password"
                  type="password"
                  className="pl-10 h-12"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
            >
              Create Account
            </Button>

          </form>
        </>
      )}
    </AuthLayout>
  );
}