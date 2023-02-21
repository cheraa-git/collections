import './styles.css'
import { FC } from "react"
import { Typography } from "@mui/material"
import { KeyboardCommandKeyIcon, SearchIcon } from "../UI/icons"

export const SearchButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  const isMacOs = navigator.userAgent.includes('Mac')

  return (
    <div className="search-btn" onClick={onClick}>
      <SearchIcon className="blue" sx={{ mr: 2 }} fontSize="small"/>
      <Typography fontSize="" mr={5}>Search...</Typography>
      <div className="shortcut">
        {
          isMacOs
            ? <KeyboardCommandKeyIcon className="self-center" fontSize="inherit"/>
            : <span>CTRL+</span>
        }
        <span>K</span>
      </div>
    </div>
  )
}
