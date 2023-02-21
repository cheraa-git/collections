import { useSnackbar } from "notistack"
import { Box, Button, Dialog, Typography } from "@mui/material"


export const useConfirm = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const closeHandler = () => {
    closeSnackbar()
  }


  const getDialogHtml = (message: string, action: () => void) => (
    <div>
      <Dialog open={true} fullWidth maxWidth="xs" onClose={closeHandler}>
        <Box p={3}>
          <Typography variant="h5">Are you sure?</Typography>
          <Typography pb={1} mb={1} className="border-b">{message}</Typography>
          <Box display="flex" justifyContent="space-between">
            <Button color="inherit" onClick={closeHandler}>Cancel</Button>
            <Button onClick={() => {
              action()
              closeHandler()
            }}>Ok</Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  )

  const showConfirm = (message: string, action: () => void) => {
    enqueueSnackbar(message, {
      content: getDialogHtml(message, action),
      anchorOrigin: { vertical: "top", horizontal: "center" },
      persist: true,
      preventDuplicate: true,
      transitionDuration: { appear: 0, exit: 0, enter: 0 },
    })
  }
  return { showConfirm }
}
