import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import { ProfilePage } from "./pages/ProfilePage"
import { MainPage } from "./pages/MainPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { NavBar } from "./components/NavBar/NavBar"
import { CreateCollectionPage } from "./pages/CreateCollectionPage"
import { clientRoutes } from './constants/routes'
import { useAppDispatch } from "./store/store"
import { useAuth } from "./hooks/authHook"
import { autoLogin } from "./store/actions/userActions"

function App() {
  const dispatch = useAppDispatch()
  const { isAuth } = useAuth()
  const { MAIN, PROFILE, CREATE_COLLECTION } = clientRoutes


  useEffect(() => {
    if (!isAuth) {
      dispatch(autoLogin())
    }
  }, [isAuth, dispatch])

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path={MAIN} element={<MainPage/>}/>
        <Route path="/auth/:mode" element={<AuthPage/>}/>
        <Route path={CREATE_COLLECTION} element={<CreateCollectionPage/>}/>
        <Route path={PROFILE} element={<ProfilePage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </>
  )
}

export default App
