import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { Spinner } from "../components/UI/Loader/Spinner"
import { setErrorMessage } from "../store/slices/userSlice"
import { RegisterContent } from "../components/auth/RegisterContent"
import { LoginContent } from "../components/auth/LoginContent"
import { useAuth } from "../hooks/authHook"
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export function AuthPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { mode } = useParams()
  const { errorMessage, loading } = useAppSelector((state: RootState) => state.user)
  const { isAuth } = useAuth()

  useEffect(() => {
    dispatch(setErrorMessage(''))
  }, [mode, dispatch])

  useEffect(() => {
    if (isAuth) navigate('/')
  }, [isAuth, navigate])


  if (loading) return <div className="text-center my-[40vh]"><Spinner/></div>
  return (
    <div className="bg-white w-min p-7 mx-auto mt-16 rounded">

      <p className="w-full bg-red-100 rounded text-center">{errorMessage}</p>
      <div className="text-center h-[28px] text-orange-400 mb-4">
        {mode === 'signup' ? <PersonAddIcon fontSize="large"/> : <LoginIcon fontSize="large"/>}
      </div>
      {mode === 'signup' ? <RegisterContent/> : <LoginContent/>}
    </div>
  )
}
