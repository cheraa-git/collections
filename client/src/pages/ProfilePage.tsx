import { FC, useEffect } from "react"
import { Grid } from "@mui/material"
import { CollectionCard } from "../components/CollectionCard"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { useParams } from "react-router-dom"
import { getProfile } from "../store/actions/profileActions"
import { ProfileUserInfo } from "../components/ProfileUserInfo"

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch()
  const { collections, profileUser } = useAppSelector((state: RootState) => state.profile)
  const { userId } = useParams()

  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId))
    }
  }, [userId, dispatch])
  return (
    <div className="m-6">
      <ProfileUserInfo/>
      <Grid container spacing={2}>
        {collections.map(collection => (
          <Grid item xs={6} key={collection.id}>
            <CollectionCard collection={collection} user={profileUser}/>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
