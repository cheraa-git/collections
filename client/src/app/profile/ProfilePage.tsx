import { FC, useEffect } from "react"
import { Container } from "@mui/material"
import { CollectionCard } from "../collection/CollectionCard"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { useParams } from "react-router-dom"
import { getProfile } from "../../store/actions/profileActions"
import { ProfileUserInfo } from "./ProfileUserInfo"

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch()
  const { collections, profileUser } = useAppSelector((state: RootState) => state.profile)
  const { userId } = useParams()

  const sortCollections = () => {
    return [...collections].sort((a, b) => +a.timestamp - +b.timestamp)
  }

  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId))
    }
  }, [userId, dispatch])
  return (
    <Container maxWidth="lg">
      <ProfileUserInfo/>
      {sortCollections().map(collection => (
        <CollectionCard key={collection.id} collection={collection} user={profileUser}/>
      ))}
    </Container>
  )
}
