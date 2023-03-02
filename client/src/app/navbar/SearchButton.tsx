import './styles.css'
import { FC } from "react"
import { KeyboardCommandKeyIcon, SearchIcon } from "../../common/icons"
import { Text } from "../../common/Text"
import { Typography } from "@mui/material"

export const SearchButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  const isMacOs = navigator.userAgent.includes('Mac')

  return (
    <div className="search-btn" onClick={onClick}>
      <SearchIcon className="blue" sx={{ mx: 1 }} fontSize="small"/>
      <Text className="search-btn-title">Search...</Text>
      <div className="shortcut">
        {
          isMacOs
            ? <KeyboardCommandKeyIcon className="self-center" fontSize="inherit"/>
            : <span>CTRL+</span>
        }
        <Typography fontSize="medium">K</Typography>
      </div>
    </div>
  )
}
