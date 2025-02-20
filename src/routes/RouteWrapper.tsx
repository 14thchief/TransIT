import ErrorBoundary from "components/Global/ErrorBoundary/ErrorBoundary";
import SuspenseElement from "components/Global/SuspenseElement";
import { ReactNode, Suspense } from "react";
import { useLocation } from "react-router-dom";

const RouteWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <ErrorBoundary resetKeys={[location.pathname]}>
      <Suspense fallback={<SuspenseElement />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default RouteWrapper;
