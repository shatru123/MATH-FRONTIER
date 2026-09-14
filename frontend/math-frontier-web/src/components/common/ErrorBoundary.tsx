import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">
            {this.props.fallbackTitle || "Visualization could not be loaded"}
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {this.props.fallbackDescription ||
              "A WebGL or rendering error occurred. You can still read the mathematical theory, or try reloading the interactive scene."}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Scene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
