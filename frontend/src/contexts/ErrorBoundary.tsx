import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-text-primary text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-critical/10 mb-6 border border-critical/20">
            <ShieldAlert className="h-10 w-10 text-critical" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-text-secondary max-w-md mb-8">
            The application encountered an unexpected error. Our team has been notified.
          </p>
          <Button onClick={() => window.location.reload()} size="lg">
            Reload Application
          </Button>
          
          {import.meta.env.DEV && this.state.error && (
            <div className="mt-12 text-left bg-surface border border-border p-4 rounded-card overflow-auto w-full max-w-3xl">
              <p className="text-critical font-mono text-sm mb-2">{this.state.error.toString()}</p>
              <pre className="text-text-muted font-mono text-xs whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
