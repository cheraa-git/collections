import { connectSearchBox } from "react-instantsearch-dom"
import { CloseIcon, SearchIcon } from "../UI/icons"
import { IconButton, TextField } from "@mui/material"


export const SearchInput = connectSearchBox(({ currentRefinement, refine }) => {
  return (
    <TextField
      className="bg-gray"
      value={currentRefinement}
      onChange={event => refine(event.currentTarget.value)}
      fullWidth
      InputProps={{
        startAdornment: <SearchIcon color="primary"/>,
        endAdornment: <IconButton onClick={() => refine('')}><CloseIcon/></IconButton>
      }}/>
  )
})

