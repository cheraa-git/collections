import { FC, useState } from "react"
import { DeleteIcon, EditIcon, MoreVertIcon } from "../UI/icons"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { deleteCollection } from "../../store/actions/collectionActions"
import { useNavigate } from "react-router-dom"
import { useConfirm } from "../../hooks/confirmHook"
import { useAppDispatch } from "../../store/store"
import { useCollection } from "../../hooks/collectionStateHook"

export const EditCollectionMenu: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showConfirm } = useConfirm()
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const { collection, itemConfigs } = useCollection()

  const deleteHandler = () => {
    setMenuAnchorEl(null)
    showConfirm('It will be impossible to restore the collection.', () => {
      dispatch(deleteCollection(collection, navigate))
    })
  }

  const editHandler = () => {
    setMenuAnchorEl(null)
    navigate('/create_collection', { state: { editable: { collection, itemConfigs } } })
  }

  return (
    <>
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}><MoreVertIcon/></IconButton>
      <Menu open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)} anchorEl={menuAnchorEl}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
      >
        <MenuItem onClick={editHandler}><EditIcon sx={{ mr: 2 }}/>Edit collection</MenuItem>
        <MenuItem onClick={deleteHandler}><DeleteIcon sx={{ mr: 2 }} className="red"/>Delete collection</MenuItem>
      </Menu>
    </>
  )
}
