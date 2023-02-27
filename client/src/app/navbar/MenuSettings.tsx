import { FC } from "react"
import { Button, ButtonProps, Grid, ListItem, PaletteMode } from "@mui/material"
import { useApp } from "../../hooks/appStateHook"
import { setLang, setTheme } from "../../store/slices/appSlice"
import { useAppDispatch } from "../../store/store"
import { Lang } from "../../types/app"
import { DarkModeIcon, LightModeIcon } from "../../common/icons"
import { Text } from "../../common/Text"
import { useTranslation } from "react-i18next"


export const MenuSettings: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { theme, lang } = useApp()

  const getLangBtnProps = (currentLang: Lang): ButtonProps => {
    return {
      variant: currentLang === lang ? 'outlined' : 'text',
      disabled: currentLang === lang,
      onClick: () => dispatch(setLang(currentLang)),
      size: 'small',
      fullWidth: true,
      sx: { mx: 0.5 }
    }
  }

  const getThemeBtnProps = (currentTheme: PaletteMode): ButtonProps => {
    return {
      variant: currentTheme === theme ? 'outlined' : 'text',
      disabled: currentTheme === theme,
      onClick: () => dispatch(setTheme(currentTheme)),
      size: 'small',
      fullWidth: true,
      sx: { mx: 0.5 }
    }
  }

  return (
    <ListItem>
      <Grid container spacing={1} width="250px">
        <Grid item xs={3} alignSelf="center">
          <Text fontWeight="bold" fontSize="small">theme</Text>
        </Grid>
        <Grid item xs={9} display="flex">
          <Button {...getThemeBtnProps('dark')}>
            <DarkModeIcon fontSize="small" sx={{ mr: 0.5 }}/>
            {t('Dark')}
          </Button>
          <Button {...getThemeBtnProps('light')}>
            <LightModeIcon fontSize="small"/>
            {t('Light')}
          </Button>
        </Grid>

        <Grid item xs={3} alignSelf="center" display="flex" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="small">lang</Text>
        </Grid>
        <Grid item xs={9} display="flex">
          <Button {...getLangBtnProps('ru')}>ru</Button>
          <Button {...getLangBtnProps('en')} >en</Button>
        </Grid>
      </Grid>
    </ListItem>
  )
}
