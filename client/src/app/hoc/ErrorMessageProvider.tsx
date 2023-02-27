import { FC, ReactNode, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { useSnackbar } from "notistack"
import { setItemErrorMessage } from "../../store/slices/itemSlice"
import { IconButton, Tooltip } from "@mui/material"
import { ReplyIcon } from "../../common/icons"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { setCollectionErrorMessage } from "../../store/slices/collectionSlice"
import { setUnknownError } from "../../store/slices/appSlice"

export const ErrorMessageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar: snackbar, closeSnackbar } = useSnackbar()
  const itemErrorMessage = useAppSelector((state: RootState) => state.item.errorMessage)
  const collectionErrorMessage = useAppSelector((state: RootState) => state.collection.errorMessage)
  const isUnknownError = useAppSelector((state: RootState) => state.app.isUnknownError)

  const onGoBack = () => {
    navigate(-1)
    closeSnackbar()
  }

  const onGoHome = () => {
    navigate('/')
    closeSnackbar()
  }

  const showErrorSnackbar = (message: string, action = onGoBack, tooltip = 'Go back') => {
    snackbar(t(message), {
      variant: "warning",
      persist: true,
      preventDuplicate: true,
      action: (
        <Tooltip title={t(tooltip)}>
          <IconButton onClick={action}><ReplyIcon/></IconButton>
        </Tooltip>
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
      showErrorSnackbar('Something went wrong. Try to return to the main page', onGoHome, 'Go to the main page')
      dispatch(setUnknownError(false))
    }
  }, [itemErrorMessage, collectionErrorMessage, isUnknownError])
  return (
    <>
      {children}
    </>
  )
}
