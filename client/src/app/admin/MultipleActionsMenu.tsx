import { FC, MouseEvent, useState } from "react"
import { TransButton } from "../../common/TransButton"
import { AdminPanelSettingsIcon, BlockIcon, CheckCircleOutlineIcon, DeleteIcon } from "../../common/icons"
import { Text } from "../../common/Text"
import { Box, Button, Menu } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { setAdminStatus, setUsersStatus } from "../../store/actions/adminActions"
import { UserStatus } from "../../../../common/types/user"

export const MultipleActionsMenu: FC<{ selectionModel: number[] }> = ({ selectionModel }) => {
  const dispatch = useAppDispatch()
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null)

  const openActionsMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorMenu(event.currentTarget)
  }
  const closeActionsMenu = () => {
    setAnchorMenu(null)
  }

  const statusHandler = (status: UserStatus) => {
    dispatch(setUsersStatus(selectionModel, status))
  }

  const adminHandler = (status: boolean) => {
    dispatch(setAdminStatus(selectionModel, status))
  }


  return (
    <>
      <TransButton onClick={openActionsMenu} disabled={selectionModel.length === 0}>Multiple actions</TransButton>
      <Menu open={Boolean(anchorMenu)} anchorEl={anchorMenu} onClose={closeActionsMenu}>
        <Box>
          <Button onClick={() => adminHandler(true)}>
            <AdminPanelSettingsIcon/>
            <Text fontSize="small">Make admins</Text>
          </Button>
        </Box>
        <Box>
          <Button onClick={() => adminHandler(false)}>
            <AdminPanelSettingsIcon color="action"/>
            <Text fontSize="small">Make users</Text>
          </Button>
        </Box>
        <Box>
          <Button onClick={() => statusHandler('active')}>
            <CheckCircleOutlineIcon color={selectionModel.length === 0 ? "disabled" : "success"}/>
            <Text fontSize="small">Activate</Text>
          </Button>
        </Box>
        <Box>
          <Button onClick={() => statusHandler('blocked')}>
            <BlockIcon color={selectionModel.length === 0 ? "disabled" : "warning"}/>
            <Text fontSize="small">Block</Text>
          </Button>
        </Box>
        <Box>
          <Button onClick={() => statusHandler('deleted')}>
            <DeleteIcon color={selectionModel.length === 0 ? "disabled" : "error"}/>
            <Text fontSize="small">Delete</Text>
          </Button>
        </Box>
      </Menu>
    </>
  )
}
