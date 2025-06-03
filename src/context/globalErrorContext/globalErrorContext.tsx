import React, { createContext, useContext, useState } from "react";
import ErrorModal from "../../components/ErrorModel";

interface ErrorMsg {
  msg: string;
}

interface ErrorData {
    title: string;
    errors: ErrorMsg[];
}

interface ErrorContextType {
  errorData: ErrorData | null;
  showError: (data: ErrorData) => void;
  hideError: () => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export default function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  const showError = (data: ErrorData) => setErrorData(data);
  const hideError = () => setErrorData(null);

  return (
    <ErrorContext.Provider value={{ errorData, showError, hideError }}>
      {children}
      {errorData && <ErrorModal errorData={errorData} onClose={hideError} />}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}