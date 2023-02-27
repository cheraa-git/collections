import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Lang } from "../../types/app"
import { LANG, THEME } from "../../constants/localstorage"
import { PaletteMode } from '@mui/material'
import i18n from "../../i18n"

export interface AppState {
  theme: PaletteMode
  lang: Lang
  loading: boolean
  searchOpen: boolean
  isUnknownError: boolean
}

const initialState: AppState = {
  theme: localStorage.getItem(THEME) as PaletteMode || "dark",
  lang: localStorage.getItem(LANG) as Lang || 'en',
  loading: false,
  searchOpen: false,
  isUnknownError: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLang: (state, { payload }: PayloadAction<Lang>) => {
      localStorage.setItem(LANG, payload)
      i18n.changeLanguage(payload)
      state.lang = payload
    },
    setTheme: (state, { payload }: PayloadAction<PaletteMode>) => {
      localStorage.setItem(THEME, payload)
      state.theme = payload
      document.documentElement.style.setProperty('--color-canvas-default', '#FFFFFF14')
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload
    },
    setSearchOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.searchOpen = payload
    },
    setUnknownError: (state, { payload }: PayloadAction<boolean>) => {
      state.isUnknownError = payload
    }

  }
})

export const { setLang, setTheme, setLoading, setSearchOpen, setUnknownError } = appSlice.actions

export const AppReducer = appSlice.reducer
