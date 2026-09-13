import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './auth/AuthContext'
import './styles.css'
import './app.css'
import './register.css'
import './marketplace.css'
import './crm.css'
import './professional.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider><App /></AuthProvider>
  </React.StrictMode>
)
