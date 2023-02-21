import { FC, MouseEvent, useState } from "react"
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { clientRoutes as routes } from "../../constants/routes"
import { useAuth } from "../../hooks/authHook"
import { MenuSettings } from "./MenuSettings"
import { AccountCircleIcon, AddIcon, LoginIcon, LogoutIcon, MenuIcon, PersonAddIcon } from '../UI/icons'
import { Text } from "../UI/Text"


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
    <>
      <IconButton onClick={handleClick} sx={{ ml: 2 }}>
        <MenuIcon color="primary"/>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            transformOrigin={{ vertical: 'top', horizontal: 'right', }}
      >

        <Box hidden={!isAuth}>
          <Link to={`/profile/${currentUser.id}`} onClick={handleClose}>
            <MenuItem>
              <AccountCircleIcon color="primary"/>
              <Typography ml={2} className="capitalize">{currentUser.nickname}</Typography>
            </MenuItem>
          </Link>

          <Link to={routes.CREATE_COLLECTION} onClick={handleClose}>
            <MenuItem>
              <AddIcon color="primary"/>
              <Text ml={2}>Create collection</Text>
            </MenuItem>
          </Link>
          <MenuItem onClick={logoutHandler}>
            <LogoutIcon color="primary"/>
            <Text ml={2}>Logout</Text>
          </MenuItem>
        </Box>

        <Box hidden={isAuth}>
          <Link to={routes.AUTH.LOGIN}>
            <MenuItem onClick={handleClose}>
              <Text>Login</Text>
              <LoginIcon sx={{ ml: 4 }} color="primary" fontSize="small"/>
            </MenuItem>
          </Link>
          <Link to={routes.AUTH.REGISTER}>
            <MenuItem onClick={handleClose}>
              <Text>Sign up</Text>
              <PersonAddIcon sx={{ ml: 2 }} color="primary" fontSize="small"/>
            </MenuItem>
          </Link>
        </Box>

        <Divider/>

        <MenuSettings/>
      </Menu>
    </>
  )
}
