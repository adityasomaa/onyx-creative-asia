"use client";

/**
 * Error boundary and fallback for WebGL components.
 *
 * Adapted from componentry.dev (MIT License, Copyright (c) 2026 Harsh
 * Jadhav). The fallback uses the site's bone and ink tokens instead of a
 * zinc/slate gradient.
 */

import { cn } from "@/lib/cn";
import * as React from "react";

interface WebGLErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends React.Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  public state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <WebGLFallback />;
    }
    return this.props.children;
  }
}

interface WebGLFallbackProps {
  className?: string;
  message?: string;
}

export function WebGLFallback({
  className,
  message = "Interactive WebGL content is unavailable on this device/browser.",
}: WebGLFallbackProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-bone-200 px-4 text-center text-sm text-ink/60",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>
    </div>
  );
}
