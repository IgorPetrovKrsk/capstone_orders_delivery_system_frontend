import type { ReactNode } from "react";
import AuthProvider from "../authContext/authContext"
import ErrorProvider from "../globalErrorContext/globalErrorContext";
import UserProvider from "../userContext/userContext";
import LoadingProvider from "../globalLoadingCintext/globalLoadingContext";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorProvider>
      <LoadingProvider>
        <UserProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </UserProvider>
      </LoadingProvider>
    </ErrorProvider>
  )
}