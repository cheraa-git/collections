import { useSnackbar } from "notistack"
import { Button, Dialog } from "@mui/material"


export const useConfirm = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const closeHandler = () => {
    closeSnackbar()
  }


  const getDialogHtml = (message: string, action: () => void) => (
    <div>
      <Dialog open={true} fullWidth onClose={closeHandler}>
        <div className="p-5">
          <h2>Are you sure?</h2>
          <p className="border-b pb-2 mb-2">{message}</p>
          <div className="flex justify-between text-gray-400">
            <Button color="inherit" onClick={closeHandler}>Cancel</Button>
            <Button onClick={() => {
              action()
              closeHandler()
            }}>Ok</Button>
          </div>
        </div>
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
