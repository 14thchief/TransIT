import { ComponentType, ReactNode } from "react";
import {
  ErrorBoundary as ErrorHandler,
  FallbackProps,
} from "react-error-boundary";
import ComponentFallback from "./ComponentFallback";

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
  resetKeys?: string[];
  fallback?: ComponentType<FallbackProps>;
};
const ErrorBoundary = ({
  children,
  onReset,
  resetKeys,
  fallback,
}: ErrorBoundaryProps) => {
  const handleError = (error: any, info: any) => {
    console.error(error, info);
  };

  return (
    <ErrorHandler
      FallbackComponent={
        fallback || (ComponentFallback as ComponentType<FallbackProps>)
      }
      onError={handleError}
      onReset={onReset}
      resetKeys={resetKeys || []}
    >
      {children}
    </ErrorHandler>
  );
};

export default ErrorBoundary;
