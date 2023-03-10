import { FC, MouseEvent, useState } from "react"
import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/authHook"
import { MenuSettings } from "./MenuSettings"
import {
  AccountCircleIcon,
  AddIcon,
  AdminPanelSettingsIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  PersonAddIcon
} from '../../common/icons'
import { Text } from "../../common/Text"


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
              <Text variant="caption" alignSelf="center" ml="auto" hidden={!currentUser.isAdmin}>admin</Text>
            </MenuItem>
          </Link>

          <Link to="/admin" onClick={handleClose} hidden={!currentUser.isAdmin}>
            <MenuItem>
              <AdminPanelSettingsIcon/>
              <Text ml={2}>Admin panel</Text>
            </MenuItem>
          </Link>

          <Link to="/create_collection" onClick={handleClose}>
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
          <Link to="/auth/login">
            <MenuItem onClick={handleClose}>
              <Text>Login</Text>
              <LoginIcon sx={{ ml: 4 }} color="primary" fontSize="small"/>
            </MenuItem>
          </Link>
          <Link to="/auth/signup">
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
