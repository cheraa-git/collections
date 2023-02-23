import { FC, useEffect } from "react"
import { useAuth } from "../hooks/authHook"
import { useNavigate } from "react-router-dom"
import { UsersList } from "../components/admin/UsersList"
import { Container } from "@mui/material"

export const AdminPage: FC = () => {
  const {currentUser} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser.isAdmin) navigate('/')
  }, [])
  return (
    <Container maxWidth="lg">
      <UsersList/>
    </Container>
  )
}
