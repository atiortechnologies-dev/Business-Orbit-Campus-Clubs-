import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend only
    console.log("Reset password request:", email);

    setSent(true);
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset Password"
      subtitle="Enter your email address"
      footer={
        <Link
          to="/login"
          className="text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Back to Login
        </Link>
      }
    >
      {sent ? (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            Request Submitted
          </h3>

          <p className="text-sm text-muted-foreground">
            This is a frontend demo.
            <br />
            Connect Firebase or your backend later to send a real reset email.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">

            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email Address
            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />

            </div>

          </div>

          <Button
            type="submit"
            className="w-full h-12"
          >
            Send Reset Link
          </Button>

        </form>
      )}
    </AuthLayout>
  );
}