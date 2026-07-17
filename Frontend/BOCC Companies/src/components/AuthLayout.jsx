import React from "react";

/**
 * @typedef {Object} AuthLayoutProps
 * @property {React.ComponentType<any>} icon
 * @property {string} title
 * @property {string} [subtitle]
 * @property {React.ReactNode} [footer]
 * @property {React.ReactNode} [children]
 */

/**
 * @param {AuthLayoutProps} props
 */
export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon
              className="w-7 h-7 text-primary-foreground"
              aria-hidden="true"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}