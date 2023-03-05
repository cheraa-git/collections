import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { Spinner } from "../../common/Loader/Spinner"
import { setAuthErrorMessage, setAuthInfoMessage } from "../../store/slices/userSlice"
import { RegisterContent } from "./RegisterContent"
import { LoginContent } from "./LoginContent"
import { useAuth } from "../../hooks/authHook"
import { LoginIcon, PersonAddIcon } from "../../common/icons"
import { Box } from "@mui/material"
import { Text } from "../../common/Text"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import { AuthProviderButtons } from "./AuthProviderButtons"

export function AuthPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const navigate = useNavigate()
  const { mode } = useParams()
  const { errorMessage, tokenError, loading, infoMessage } = useAppSelector((state: RootState) => state.user)
  const { isAuth } = useAuth()


  useEffect(() => {
    if (infoMessage) {
      snackbar(t(infoMessage), { autoHideDuration: 10000 })
      dispatch(setAuthInfoMessage(''))
    }
  }, [infoMessage, dispatch, t, snackbar])

  useEffect(() => {
    dispatch(setAuthErrorMessage(''))
  }, [mode, dispatch])

  useEffect(() => {
    if (isAuth) navigate('/')
  }, [isAuth, navigate])


  if (loading) return <Box textAlign="center" my="40vh"><Spinner/></Box>
  return (
    <Box width="min-content" px={8} py={3} mx="auto" mt={8} className="rounded border">
      <Text textAlign="center" className="bg-red rounded">{tokenError || errorMessage}</Text>
      <Box textAlign="center" height={28} mb={2}>
        {mode === 'signup'
          ? <PersonAddIcon color="primary" fontSize="large"/>
          : <LoginIcon color="primary" fontSize="large"/>}
      </Box>
      {mode === 'signup' ? <RegisterContent/> : <LoginContent/>}
      <Text variant="h6" className="border-t" mt={2}>Authorization with</Text>
      <AuthProviderButtons/>
    </Box>
  )
}
