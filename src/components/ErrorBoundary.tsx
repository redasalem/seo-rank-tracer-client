import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="glass max-w-md w-full p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center text-danger mb-6">
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We've encountered an unexpected error. Please try refreshing the page or going back to home.
            </p>
            {this.state.error && (
              <div className="bg-muted w-full p-3 rounded-lg text-left overflow-x-auto mb-6 border border-border">
                <code className="text-xs text-danger font-mono whitespace-pre-wrap">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="bg-primary px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 w-full justify-center"
              style={{ color: "var(--background)" }}
            >
              <RefreshCcw size={18} />
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
