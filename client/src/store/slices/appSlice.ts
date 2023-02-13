import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Lang, Theme } from "../../types/app"
import { LANG, THEME } from "../../constants/localstorage"

export interface AppState {
  theme: Theme
  lang: Lang
  loading: boolean
}

const initialState: AppState = {
  theme: localStorage.getItem(THEME) as Theme || "lite",
  lang: localStorage.getItem(LANG) as Lang || 'en',
  loading: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLang: (state, { payload }: PayloadAction<Lang>) => {
      localStorage.setItem(LANG, payload)
      state.lang = payload
    },
    setTheme: (state, { payload }: PayloadAction<Theme>) => {
      localStorage.setItem(THEME, payload)
      state.theme = payload
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload
    }
  }
})

export const { setLang, setTheme, setLoading } = appSlice.actions

export const AppReducer = appSlice.reducer
