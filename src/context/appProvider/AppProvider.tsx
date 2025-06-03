import type { ReactNode } from "react";
import AuthProvider from "../authContext/authContext"
import { ErrorProvider } from "../globalErrorContext/globalErrorContext";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorProvider>
  )
}