import { FC, useEffect } from "react"
import { useAuth } from "../../hooks/authHook"
import { useNavigate } from "react-router-dom"
import { UsersDataGrid } from "./UsersDataGrid"
import { Box, Container } from "@mui/material"
import { Text } from "../../common/Text"

export const AdminPage: FC = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser.isAdmin) navigate('/')
  }, [])

  return (
    <Container maxWidth="lg">
      <Box bgcolor="#8F8F8F32" py={0.5} px={2} className="rounded" display="flex" justifyContent="space-between">
        <Text variant="h6">Admin panel</Text>
      </Box>
      <UsersDataGrid/>
    </Container>
  )
}
