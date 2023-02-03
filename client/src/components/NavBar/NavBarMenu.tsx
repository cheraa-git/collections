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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div className="border-b text-orange-500" hidden={!isAuth}>
          <MenuItem onClick={handleClose}>
            <Link to={routes.PROFILE} className="flex">
              <AccountCircleIcon/>
              <p className="ml-3 capitalize">{currentUser.nickname}</p>
            </Link>
          </MenuItem>
        </div>
        <div hidden={!isAuth}>
          <MenuItem onClick={handleClose}>
            <Link to={routes.CREATE_COLLECTION} className="flex">
              <AddIcon/>
              <p className="ml-3">Create collection</p>
            </Link>
          </MenuItem>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </div>
        <div hidden={isAuth}>
          <MenuItem onClick={handleClose}><Link to={routes.AUTH.LOGIN}>Login</Link></MenuItem>
          <MenuItem onClick={handleClose}><Link to={routes.AUTH.REGISTER}>Sign up</Link></MenuItem>
        </div>
      </Menu>
    </div>
  )
}
