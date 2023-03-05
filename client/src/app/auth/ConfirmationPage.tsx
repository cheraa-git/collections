import { FC, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Spinner } from "../../common/Loader/Spinner"
import { Box } from "@mui/material"
import { Text } from "../../common/Text"
import { editProfileInfoByToken } from "../../store/actions/profileActions"
import { useAppDispatch } from "../../store/store"
import { setUnknownError } from "../../store/slices/appSlice"
import { registerUser } from "../../store/actions/userActions"
import { setUser } from "../../store/slices/userSlice"

export const ConfirmationPage: FC = () => {
  const { mode, token } = useParams<{ mode: 'edit' | 'register', token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    (async function () {
      if (mode === 'edit') {
        const response = await editProfileInfoByToken(token)
        response
          .mapRight(({ data: userId }) => navigate(`/profile/${userId}`))
          .mapLeft(() => dispatch(setUnknownError(true)))
      }
      if (mode === 'register') {
        const response = await registerUser(token)
        response
          .mapRight(({ data: user }) => {
            dispatch(setUser(user))
            navigate(`/profile/${user.id}`)
          })
          .mapLeft(() => dispatch(setUnknownError(true)))
      }
    }())
  }, [])

  return (
    <div>
      <Text fontSize="xx-large" textAlign="center" mt="10vh">
        {
          mode === 'edit' ? 'Confirmation of account changes...' : 'Creating an account...'
        }
      </Text>
      <Box mx="auto" width="min-content" mt="10vh">
        <Spinner/>
      </Box>
    </div>
  )
}
