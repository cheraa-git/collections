import { FC, useEffect } from "react"
import { Alert, Box, Container } from "@mui/material"
import { CollectionCard } from "../collection/CollectionCard"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { useParams } from "react-router-dom"
import { getProfile } from "../../store/actions/profileActions"
import { ProfileUserInfo } from "./ProfileUserInfo"
import { Spinner } from "../../common/Loader/Spinner"

export const ProfilePage: FC = () => {
  const dispatch = useAppDispatch()
  const { collections, profileUser, loading } = useAppSelector((state: RootState) => state.profile)
  const { userId } = useParams()

  useEffect(() => {
    if (userId) {
      dispatch(getProfile(userId))
    }
  }, [userId, dispatch])

  if (profileUser.status === 'deleted') return (
      <Alert sx={{ mx: 'auto', maxWidth: 400, mt: 5 }} severity="error">The user is deleted</Alert>
  )

  return (
    <Container maxWidth="lg">
      <ProfileUserInfo/>
      {loading && <Box mx="auto" width="min-content" mt={5}><Spinner/></Box>}

      {collections.map(collection => (
        <CollectionCard key={collection.id} collection={collection} user={profileUser}/>
      ))}
    </Container>
  )
}
