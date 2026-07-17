import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, AlertTriangle } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// use native label element here to match expected props

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Password reset:", {
      token: resetToken,
      password: newPassword,
    });

    setSuccess(true);
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        title="Invalid Reset Link"
        subtitle="The password reset link is missing or invalid."
        footer={
          <Link
            to="/forgot-password"
            className="text-primary font-medium hover:underline"
          >
            Request a New Link
          </Link>
        }
      >
        <p className="text-center text-sm text-muted-foreground">
          Please request a new password reset link.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      title="Create New Password"
      subtitle="Enter your new password below"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to Login
        </Link>
      }
    >
      {success ? (
        <div className="text-center space-y-3">

          <h3 className="text-xl font-semibold">
            Password Reset Successful 🎉
          </h3>

          <p className="text-muted-foreground">
            This is only the frontend.
            <br />
            Connect Firebase or your backend later.
          </p>

          <Button asChild className="w-full mt-4">
            <Link to="/login">
              Back to Login
            </Link>
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
              <label className="block text-sm font-medium text-muted-foreground">New Password</label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  type="password"
                  placeholder="********"
                  className="pl-10 h-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Confirm Password</label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  type="password"
                  placeholder="********"
                  className="pl-10 h-12"
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
              Reset Password
            </Button>

          </form>
        </>
      )}
    </AuthLayout>
  );
}