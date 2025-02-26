import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAccount } from "wagmi";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
