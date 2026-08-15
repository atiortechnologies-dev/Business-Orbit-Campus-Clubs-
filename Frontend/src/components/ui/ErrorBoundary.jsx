import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas-bg flex flex-col items-center justify-center p-6 text-center font-inter">
          <div className="max-w-md w-full bg-surface-white border border-border-subtle rounded-xl p-8 shadow-card space-y-4">
            <h2 className="font-poppins font-bold text-card text-text-heading">
              Something went wrong
            </h2>
            <p className="text-small text-text-muted leading-relaxed">
              An unexpected error occurred while loading this page.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full bg-action-bg text-action-text font-poppins font-semibold text-small py-2.5 rounded-lg hover:opacity-90 transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
