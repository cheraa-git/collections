import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { logoutUser } from "../store/slices/userSlice"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state: RootState) => state.user)
  return {
    isAuth: !!(currentUser.token && currentUser.email && currentUser.nickname && currentUser.id),
    currentUser,
    logout() {
      dispatch(logoutUser())
    }
  }
}
