import { FC } from "react"
import { Dialog, DialogProps } from '@mui/material'

export const TransparentDialog: FC<DialogProps> = (props) => {
  return (
    <Dialog
      slotProps={{ backdrop: { style: { backgroundColor: 'transparent', backdropFilter: "blur(8px)" } } }}
      {...props}
    >
      {props.children}
    </Dialog>
  )
}
