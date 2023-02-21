import React, { FC, ReactNode } from "react"
import { RootState, useAppSelector } from "../../store/store"
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

export const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useAppSelector((state: RootState) => state.app.theme)

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
      fontFamily: "monospace",
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

  })
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline/>
      {children}
    </ThemeProvider>
  )
}
