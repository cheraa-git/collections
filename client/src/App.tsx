import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import { ProfilePage } from "./pages/ProfilePage"
import { MainPage } from "./pages/MainPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { NavBar } from "./components/navbar/NavBar"
import { CreateCollectionPage } from "./pages/CreateCollectionPage"
import { RootState, useAppDispatch, useAppSelector } from "./store/store"
import { useAuth } from "./hooks/authHook"
import { autoLogin } from "./store/actions/userActions"
import { CollectionPage } from "./pages/CollectionPage"
import { ItemPage } from "./pages/ItemPage"
import { useCollection } from "./hooks/collectionStateHook"
import { getThemes } from "./store/actions/collectionActions"
import { getTags } from "./store/actions/itemActions"
import { useTranslation } from "react-i18next"
import { useApp } from "./hooks/appStateHook"
import { AdminPage } from "./pages/AdminPage"


function App() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = useApp().lang
  const dispatch = useAppDispatch()
  const { isAuth, tokenError } = useAuth()
  const themes = useCollection().themes
  const tags = useAppSelector((state: RootState) => state.item.tags)


  useEffect(() => {
    if (themes.length === 0) {
      dispatch(getThemes())
    }
    if (tags.length === 0) {
      dispatch(getTags())
    }
    i18n.changeLanguage(lang)
    if (tokenError) navigate('/auth/login')
    if (!isAuth) {
      dispatch(autoLogin())
    }
  }, [isAuth, dispatch, tags.length, themes.length, i18n, lang, tokenError])
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/auth/:mode" element={<AuthPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="create_collection" element={<CreateCollectionPage/>}/>
        <Route path="/profile/:userId" element={<ProfilePage/>}/>
        <Route path="/collection/:id" element={<CollectionPage/>}/>
        <Route path="/item/:id" element={<ItemPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </>
  )
}

export default App
