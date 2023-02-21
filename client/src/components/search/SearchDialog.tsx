import { FC } from "react"
import { TransparentDialog } from "../UI/TransparentDialog"
import { Button } from "@mui/material"

interface SearchDialogProps {
  open: boolean,
  setOpen: (open: boolean) => void
}

export const SearchDialog: FC<SearchDialogProps> = ({ open, setOpen }) => {

  document.onkeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
      setOpen(!open)
    }
  }
  return (
    <TransparentDialog
      open={open}
      fullWidth
      onClose={() => setOpen(false)}
      onKeyDown={(event) => console.log(event.code)}
    >
      <Button onClick={() => setOpen(!open)}>toggle</Button>
      asdfasdfasdfas
      as
      dfa
      sdf
    </TransparentDialog>
  )
}
