import '../styles.css'
import { connectHighlight } from "react-instantsearch-dom"
import { Box } from "@mui/material"
import { HighlightText } from "../HighlightText"
import { setSearchOpen } from "../../../store/slices/appSlice"
import { useAppDispatch } from "../../../store/store"
import { Link } from "react-router-dom"

export const SearchCollectionCard = connectHighlight(({ highlight, hit }) => {
  const dispatch = useAppDispatch()
  const highlightTitle = highlight({ highlightProperty: '_highlightResult', attribute: 'title', hit, })
  const highlightDescription = highlight({ highlightProperty: '_highlightResult', attribute: 'description', hit, })

  return (
    <Box className="search-card">
      <Link to={`/collection/${hit.id}`} onClick={() => dispatch(setSearchOpen(false))}>
        <HighlightText highlight={highlightTitle}/>
        {
          highlightDescription.find(h => h.isHighlighted)
          && <HighlightText highlight={highlightDescription} fontSize="small"/>
        }
      </Link>
    </Box>
  )
})
