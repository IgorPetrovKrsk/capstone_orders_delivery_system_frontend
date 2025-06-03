import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CookiesProvider } from 'react-cookie'
import AppProvider from './context/appProvider/AppProvider.tsx'
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <AppProvider>
        <Router>
          <App />
        </Router>
      </AppProvider>
    </CookiesProvider>
  </StrictMode>,
)
