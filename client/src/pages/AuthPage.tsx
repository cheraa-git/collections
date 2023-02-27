import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { Spinner } from "../components/UI/Loader/Spinner"
import { setAuthErrorMessage } from "../store/slices/userSlice"
import { RegisterContent } from "../components/auth/RegisterContent"
import { LoginContent } from "../components/auth/LoginContent"
import { useAuth } from "../hooks/authHook"
import { LoginIcon, PersonAddIcon } from "../components/UI/icons"
import { Box } from "@mui/material"
import { Text } from "../components/UI/Text"

export function AuthPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { mode } = useParams()
  const { errorMessage, tokenError, loading } = useAppSelector((state: RootState) => state.user)
  const { isAuth } = useAuth()

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
    </Box>
  )
}
