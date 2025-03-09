import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { SecondAuthProvider } from './contexts/SecondAuthContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <SecondAuthProvider>
    <App />
    </SecondAuthProvider>
    </AuthContextProvider>
  </StrictMode>,
)
