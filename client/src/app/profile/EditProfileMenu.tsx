import { FC, MouseEvent, useState } from "react"
import { Button, Menu } from "@mui/material"
import { EditIcon } from "../../common/icons"
import { EditInfoMenuItem } from "./EditInfoMenuItem"
import { EditImageMenuItem } from "./EditImageMenuItem"

export const EditProfileMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Button onClick={handleClick}><EditIcon fontSize="small"/></Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <EditInfoMenuItem/>
        <EditImageMenuItem/>
      </Menu>
    </div>
  )
}
