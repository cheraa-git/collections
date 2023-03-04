import '../../../styles/search-styles.css'
import { connectHighlight } from "react-instantsearch-dom"
import { Box } from "@mui/material"
import { HighlightText } from "../HighlightText"
import { setSearchOpen } from "../../../store/slices/appSlice"
import { useAppDispatch } from "../../../store/store"
import { Link } from "react-router-dom"

export const SearchItemCard = connectHighlight(({ highlight, hit }) => {
  const dispatch = useAppDispatch()
  const highlightName = highlight({ highlightProperty: '_highlightResult', attribute: 'name', hit, })

  const highlightFields: { value: string, isHighlighted: boolean }[][] = []
  Object.keys(hit).forEach((key) => {
    if (key.includes('str') || key.includes('txt')) {
      const highlightField = highlight({ highlightProperty: '_highlightResult', attribute: key, hit })
      if (highlightField.find(h => h.isHighlighted)) highlightFields.push(highlightField)
    }
  })

  return (
    <Box className="search-card">
      <Link to={`/item/${hit.id}`} onClick={() => dispatch(setSearchOpen(false))}>
        <HighlightText highlight={highlightName}/>
        {
          highlightFields.map((highlight, index) => (
            <HighlightText key={index} highlight={highlight} fontSize="small"/>
          ))}
      </Link>
    </Box>
  )
})
