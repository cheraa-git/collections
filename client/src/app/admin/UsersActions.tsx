import { useAppDispatch } from "../../store/store"
import { AdminPanelSettingsIcon, BlockIcon, CheckCircleOutlineIcon, DeleteIcon } from "../../common/icons"
import { setAdminStatus, setUsersStatus } from "../../store/actions/adminActions"
import { IconButton } from "@mui/material"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { UserStatus } from "../../../../common/types/user"

export const UserActions = (params: GridRenderCellParams) => {
  const dispatch = useAppDispatch()
  const activeColor = params.row.status === 'active' ? 'success' : 'action'
  const blockColor = params.row.status === 'blocked' ? 'warning' : 'action'
  const deleteColor = params.row.status === 'deleted' ? 'error' : 'action'

  const setStatusHandler = (status: UserStatus) => {
    dispatch(setUsersStatus([params.row.id], status))
  }

  const setAdminStatusHandler = () => {
    dispatch(setAdminStatus([params.row.id], !params.row.isAdmin))
  }


  return (
    <>
      <IconButton onClick={setAdminStatusHandler}>
        <AdminPanelSettingsIcon color={params.row.isAdmin ? 'primary' : 'action'}/>
      </IconButton>
      <IconButton disabled={activeColor === 'success'} onClick={() => setStatusHandler('active')}>
        <CheckCircleOutlineIcon color={activeColor}/>
      </IconButton>
      <IconButton disabled={blockColor === 'warning'} onClick={() => setStatusHandler('blocked')}>
        <BlockIcon color={blockColor}/>
      </IconButton>
      <IconButton disabled={deleteColor === 'error'} onClick={() => setStatusHandler('deleted')}>
        <DeleteIcon color={deleteColor}/>
      </IconButton>
    </>
  )
}
