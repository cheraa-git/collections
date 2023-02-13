import { FC, useState, MouseEvent } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { Link } from "react-router-dom"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import { clientRoutes as routes } from "../../constants/routes"
import { useAuth } from "../../hooks/authHook"

export const NavBarMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { isAuth, logout, currentUser } = useAuth()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const logoutHandler = () => {
    handleClose()
    logout()
  }


  return (
    <div>
      <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon color="primary"/>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>

        <div hidden={!isAuth}>
          <Link to={`/profile/${currentUser.id}`} onClick={handleClose} className="flex text-orange-500 border-b">
            <MenuItem className="w-full">
              <AccountCircleIcon/>
              <p className="ml-3 capitalize">{currentUser.nickname}</p>
            </MenuItem>
          </Link>

          <Link to={routes.CREATE_COLLECTION} onClick={handleClose} className="flex">
            <MenuItem>
              <AddIcon/>
              <p className="ml-3">Create collection</p>
            </MenuItem>
          </Link>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </div>

        <div hidden={isAuth}>
          <Link to={routes.AUTH.LOGIN}><MenuItem onClick={handleClose}>Login</MenuItem></Link>
          <Link to={routes.AUTH.REGISTER}><MenuItem onClick={handleClose}>Sign up</MenuItem></Link>
        </div>

      </Menu>
    </div>
  )
}
