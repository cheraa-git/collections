import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { store } from "./store/store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { AppThemeProvider } from "./components/hoc/AppThemeProvider"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppThemeProvider>
          <SnackbarProvider autoHideDuration={3000}>
            <App/>
          </SnackbarProvider>
        </AppThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()
