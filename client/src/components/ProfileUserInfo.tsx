import { FC } from "react"
import { RootState, useAppSelector } from "../store/store"
import { useAuth } from "../hooks/authHook"

export const ProfileUserInfo: FC = () => {
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const currentUser = useAuth().currentUser

  return (
    <div className="bg-orange-100">
      <h1 className="text-xl capitalize font-bold">{profileUser.nickname}</h1>
      <h1 className="text-xl capitalize font-bold">{profileUser.id === currentUser.id ? currentUser.email : ''}</h1>
    </div>
  )
}
