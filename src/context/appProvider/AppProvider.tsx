import type { ReactNode } from "react";
import AuthProvider from "../authContext/authContext"
import ErrorProvider from "../globalErrorContext/globalErrorContext";
import UserProvider from "../user/userContext";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorProvider>
      <UserProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </UserProvider>
    </ErrorProvider>
  )
}