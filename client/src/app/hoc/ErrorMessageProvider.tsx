import { FC, ReactNode, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { useSnackbar } from "notistack"
import { setItemErrorMessage } from "../../store/slices/itemSlice"
import { Box, IconButton, Tooltip } from "@mui/material"
import { CloseIcon, ReplayIcon, ReplyIcon } from "../../common/icons"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { setCollectionErrorMessage } from "../../store/slices/collectionSlice"
import { setUnknownError } from "../../store/slices/appSlice"
import { setProfileErrorMessage } from "../../store/slices/profileSlice"

export const ErrorMessageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar: snackbar, closeSnackbar } = useSnackbar()
  const itemErrorMessage = useAppSelector((state: RootState) => state.item.errorMessage)
  const collectionErrorMessage = useAppSelector((state: RootState) => state.collection.errorMessage)
  const profileErrorMessage = useAppSelector((state: RootState) => state.profile.errorMessage)
  const isUnknownError = useAppSelector((state: RootState) => state.app.isUnknownError)

  const onGoBack = () => {
    navigate(-1)
    closeSnackbar()
  }

  const onGoHome = () => {
    document.location.href = '/'
    closeSnackbar()
  }

  const showErrorSnackbar = (message: string, action = onGoBack, tooltip = 'Go back') => {
    snackbar(t(message), {
      variant: "warning",
      persist: true,
      preventDuplicate: true,
      action: (
        <Box>
          <Tooltip title={t(tooltip)}>
            <IconButton onClick={action}><ReplyIcon/></IconButton>
          </Tooltip>
          <IconButton onClick={() => window.location.reload()}><ReplayIcon/></IconButton>
          <IconButton onClick={() => closeSnackbar()}><CloseIcon/></IconButton>
        </Box>
      )
    })
  }

  useEffect(() => {
      if (itemErrorMessage) {
        showErrorSnackbar(itemErrorMessage)
        dispatch(setItemErrorMessage(''))
      }
      if (collectionErrorMessage) {
        showErrorSnackbar(collectionErrorMessage)
        dispatch(setCollectionErrorMessage(''))
      }
      if (isUnknownError) {
        showErrorSnackbar('Something went wrong...', onGoHome, 'Go to the main page')
        dispatch(setUnknownError(false))
      }
      if (profileErrorMessage) {
        showErrorSnackbar(profileErrorMessage)
        dispatch(setProfileErrorMessage(''))
      }
    },
    [itemErrorMessage, collectionErrorMessage, isUnknownError, dispatch, onGoHome, profileErrorMessage])
  return (
    <>
      {children}
    </>
  )
}
