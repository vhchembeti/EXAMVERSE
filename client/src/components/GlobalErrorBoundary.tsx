// client/src/components/GlobalErrorBoundary.tsx
// Production-Grade React Error Boundary to Prevent Blank Screen Crashes
// Provides clear user-facing recovery options, crash diagnostics, and state reset.

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Home, Trash2, Mail, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Safe client-side reporting without crashing
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('examverse_last_crash', JSON.stringify({
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString()
      }));
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('examverse_selected_exams');
        localStorage.removeItem('examverse_daily_targets');
        localStorage.removeItem('examverse_e2ee_cache');
      } catch (e) {
        // ignore
      }
      window.location.href = '/';
    }
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                Application State Handled
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                Something unexpected happened
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                EXAMVERSE encountered a client rendering exception. Your saved data, encrypted notes, and mock attempts remain protected.
              </p>
            </div>

            {/* Error Message Snippet */}
            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs text-rose-300 overflow-x-auto max-h-32">
                <strong>Error: </strong>{this.state.error.message || 'Unknown runtime exception'}
              </div>
            )}

            {/* Recovery Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>
              <button
                onClick={this.handleResetState}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs border border-slate-800 transition-all"
                title="Clears corrupted local temporary state"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Local Cache
              </button>
            </div>

            {/* Helpdesk Footer */}
            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Grievance &amp; Student Helpdesk: support@examverse.in</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
