import { FC } from "react"
import { useAppDispatch } from "../store/store"
import { useNavigate } from "react-router-dom"
import { Box, Chip } from "@mui/material"
import { useCollection } from "../hooks/collectionStateHook"
import { setSearchTheme } from "../store/slices/mainSlice"

export const ThemeChip: FC<{ themeId: number }> = ({ themeId }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { getTheme } = useCollection()
  const theme = getTheme(themeId)
  const handleClick = () => {
    navigate('/', {state: {contentType: 'collections'}})
    dispatch(setSearchTheme(themeId))
  }
  return (
    <Box m={0.5}>
      <Chip label={theme?.name} color="primary" size="medium" variant="outlined" onClick={handleClick}/>
    </Box>
  )
}
