import { FC } from "react"
import { RootState, useAppSelector } from "../store/store"
import { useAuth } from "../hooks/authHook"
import { Link } from "react-router-dom"
import { clientRoutes as routes } from "../constants/routes"
import { Button } from "@mui/material"


export const ProfileUserInfo: FC = () => {
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const currentUser = useAuth().currentUser

  return (
    <div className="bg-orange-100 mb-2 flex justify-between">
      <div>
        <h1 className="text-xl capitalize font-bold">{profileUser.nickname}</h1>
        <h1 className="text-xl capitalize font-bold">{profileUser.id === currentUser.id ? currentUser.email : ''}</h1>
      </div>
      <Link to={routes.CREATE_COLLECTION} className="flex text-blue-500">
        <Button>Create collection</Button>
      </Link>
    </div>
  )
}
