import { FC } from "react"
import { Dialog, DialogProps } from '@mui/material'

export const BlurDialog: FC<DialogProps> = (props) => {
  return (
    <Dialog
      sx={{ backdropFilter: 'blur(5px)' }}
      PaperProps={{ style: { boxShadow: 'none' } }}
      slotProps={{ backdrop: { style: { backgroundColor: 'rgba(87,111,131,0.13)', } } }}
      {...props}
    >
      {props.children}
    </Dialog>
  )
}
