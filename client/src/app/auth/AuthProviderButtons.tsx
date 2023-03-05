import { FC } from "react"
import { FacebookIconPng, GoogleIconPng } from "../../common/icons"
import { Box, IconButton, Tooltip } from "@mui/material"
import { useApp } from "../../hooks/appStateHook"
import { useAppDispatch } from "../../store/store"
import { authByProvider } from "../../store/actions/userActions"
import { facebookProvider, githubProvider, googleProvider } from "../../apis/firebase/firebase"
import { getProviderImage } from "../../apis/firebase/actions/auth"

export const AuthProviderButtons: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useApp().theme

  return (
    <Box display="flex" justifyContent="space-around">
      <Tooltip title="Google">
        <IconButton onClick={() => dispatch(authByProvider(googleProvider, 'google'))}>
          <img src={GoogleIconPng} width={40} height={40} alt="google"/>
        </IconButton>
      </Tooltip>
      <Tooltip title="GitHub">
        <IconButton onClick={() => dispatch(authByProvider(githubProvider, 'github'))}>
          <img src={getProviderImage('github', theme)} width={40} height={40} alt="github"/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Facebook">
        <IconButton onClick={() => dispatch(authByProvider(facebookProvider, 'facebook'))}>
          <img src={FacebookIconPng} width={40} height={40} alt="facebook"/>
        </IconButton>
      </Tooltip>
    </Box>
  )
}
