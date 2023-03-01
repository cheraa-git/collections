import { FC, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Spinner } from "../../common/Loader/Spinner"
import { Box } from "@mui/material"
import { Text } from "../../common/Text"
import { editProfileInfo } from "../../store/actions/profileActions"
import { useAppDispatch } from "../../store/store"
import { setUnknownError } from "../../store/slices/appSlice"

export const ConfirmationPage: FC = () => {
  const { mode, token } = useParams<{ mode: 'edit' | 'create', token: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    (async function () {
      const response = await editProfileInfo(token)
      response
        .mapRight(({ data: userId }) => navigate(`/profile/${userId}`))
        .mapLeft(() => dispatch(setUnknownError(true)))
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
