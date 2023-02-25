import { FC, MouseEvent, useState } from "react"
import { TransButton } from "../UI/TransButton"
import { Menu, MenuItem } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { Text } from "../UI/Text"
import { indexing } from "../../store/actions/adminActions"

export const IndexingMenu: FC = () => {
  const dispatch = useAppDispatch()
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null)

  const openActionsMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorMenu(event.currentTarget)
  }
  const closeActionsMenu = () => {
    setAnchorMenu(null)
  }

  return (
    <>
      <TransButton onClick={openActionsMenu}>Indexing</TransButton>
      <Menu open={Boolean(anchorMenu)} anchorEl={anchorMenu} onClose={closeActionsMenu}>
        <MenuItem onClick={() => dispatch(indexing('items'))}>
          <Text>Indexing items</Text>
        </MenuItem>
        <MenuItem onClick={() => dispatch(indexing('collections'))}>
          <Text>Indexing collections</Text>
        </MenuItem>
        <MenuItem onClick={() => dispatch(indexing('comments'))}>
          <Text>Indexing comments</Text>
        </MenuItem>
      </Menu>
    </>
  )
}
