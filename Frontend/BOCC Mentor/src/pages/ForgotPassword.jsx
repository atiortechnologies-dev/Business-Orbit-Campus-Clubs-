import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Label = "label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // No backend - just show success message
    console.log("Password reset requested for:", email);

    setSent(true);
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset Password"
      subtitle="We'll send you a link to reset it"
      footer={/** @type {any} */ (
        <Link
          to="/login"
          className="text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Back to log in
        </Link>
      )}
    >
      {sent ? (
        <p className="text-sm text-center text-foreground">
          If an account exists with that email, you'll receive a password reset
          link shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12">
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}