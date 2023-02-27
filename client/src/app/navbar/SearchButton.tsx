import './styles.css'
import { FC } from "react"
import { KeyboardCommandKeyIcon, SearchIcon } from "../../common/icons"
import { Text } from "../../common/Text"

export const SearchButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  const isMacOs = navigator.userAgent.includes('Mac')

  return (
    <div className="search-btn" onClick={onClick}>
      <SearchIcon className="blue" sx={{ mr: 2 }} fontSize="small"/>
      <Text mr={5}>Search...</Text>
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
