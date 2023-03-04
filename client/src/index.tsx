import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
// import './common/styles/animations.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { store } from "./store/store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { AppThemeProvider } from "./app/hoc/AppThemeProvider"
import './locales/i18n'
import { ErrorMessageProvider } from "./app/hoc/ErrorMessageProvider"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AppThemeProvider>
          <SnackbarProvider autoHideDuration={3000}>
            <ErrorMessageProvider>
              <App/>
            </ErrorMessageProvider>
          </SnackbarProvider>
        </AppThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()
