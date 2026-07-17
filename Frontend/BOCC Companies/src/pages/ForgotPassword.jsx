import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (
    /** @type {React.FormEvent<HTMLFormElement>} */ e
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO:
      // Replace this with your authentication provider.
      // Example:
      // await firebase.auth().sendPasswordResetEmail(email);
      // await supabase.auth.resetPasswordForEmail(email);

      // Temporary delay to simulate an API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      title="Reset Password"
      subtitle="We'll send you a link to reset your password."
      footer=""
    >
      {sent ? (
        <p className="text-sm text-center">
          If an account exists with that email address, you'll receive a
          password reset link shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => setEmail(e.target.value)}
                className="pl-10 h-12"
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      )}
      <div className="text-center mt-4">
        <Link
          to="/login"
          className="text-primary font-medium hover:underline"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}