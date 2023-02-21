import { FC } from "react"
import { Button, ButtonProps, Grid, ListItem, PaletteMode, Typography } from "@mui/material"
import { useApp } from "../../hooks/appStateHook"
import { setLang, setTheme } from "../../store/slices/appSlice"
import { useAppDispatch } from "../../store/store"
import { Lang } from "../../types/app"
import { DarkModeIcon, LightModeIcon } from "../UI/icons"


export const MenuSettings: FC = () => {
  const dispatch = useAppDispatch()
  const { theme, lang } = useApp()

  const getLangBtnProps = (currentLang: Lang): ButtonProps => {
    return {
      variant: currentLang === lang ? 'outlined' : 'text',
      disabled: currentLang === lang,
      onClick: () => dispatch(setLang(currentLang)),
      size: 'small',
      fullWidth: true
    }
  }

  const getThemeBtnProps = (currentTheme: PaletteMode): ButtonProps => {
    return {
      variant: currentTheme === theme ? 'outlined' : 'text',
      disabled: currentTheme === theme,
      onClick: () => dispatch(setTheme(currentTheme)),
      size: 'small',
      fullWidth: true
    }
  }

  return (
    <ListItem>
      <Grid container spacing={1} width="200px">
        <Grid item xs={3} alignSelf="center">
          <Typography fontWeight="bold" fontSize="small">theme</Typography>
        </Grid>
        <Grid item xs={9} display="flex">
          <Button {...getThemeBtnProps('dark')}>
            <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }}/>Dark
          </Button>
          <Button {...getThemeBtnProps('light')}>
            <LightModeIcon fontSize="small" sx={{ mr: 0.5 }}/>Light
          </Button>
        </Grid>

        <Grid item xs={3} alignSelf="center" display="flex" justifyContent="space-between">
          <Typography fontWeight="bold" fontSize="small">lang</Typography>
        </Grid>
        <Grid item xs={9} display="flex">
          <Button {...getLangBtnProps('ru')}>ru</Button>
          <Button {...getLangBtnProps('en')} >en</Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}
