import React, { FC, ReactNode } from "react"
import { RootState, useAppSelector } from "../../store/store"
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { enUS, ruRU } from '@mui/x-data-grid'

export const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, lang } = useAppSelector((state: RootState) => state.app)
  const getDataGridLang = () => {
    if (lang === 'ru') {
      return ruRU
    } else if (lang === 'en') {
      return enUS
    }
    return enUS
  }
  const darkPalette: ThemeOptions['palette'] = {
    text: {
      primary: '#c2c2c2',
    },
    divider: "#797878",

  }

  const palette = theme === 'dark' ? darkPalette : {}


  const appTheme = createTheme({
    palette: {
      mode: theme,
      ...palette
    },
    typography: {
      fontFamily: "'Ubuntu', sans-serif;",
      fontWeightRegular: '300',
      h1: {
        fontWeight: "bold"
      },
      h2: {
        fontWeight: "bold"
      },
      h3: {
        fontWeight: "bold"
      },
      h4: {
        fontWeight: "bold"
      },
      h5: {
        fontWeight: "bold"
      },
      h6: {
        fontWeight: "bold"
      },
    },
  }, getDataGridLang())
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline/>
      {children}
    </ThemeProvider>
  )
}
