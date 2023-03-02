import { FC, useState } from "react"
import { Box, Container } from "@mui/material"
import { ItemsList } from "./ItemsList"
import { CollectionsList } from "./CollectionsList"
import { TransButton } from "../../common/TransButton"
import { useLocation, useNavigate } from "react-router-dom"


export const MainPage: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [contentType, setContentType] = useState<'items' | 'collections'>(location.state?.contentType || 'items')


  const setContentTypeHandler = (value: 'items' | 'collections') => {
    setContentType(value)
    navigate('/', { state: { contentType: value } })
  }

  return (
    <Box my={2}>
      <Container maxWidth="lg" className="">

        <Box width="max-content" ml="auto" mb={1}>
          <TransButton
            variant={contentType === 'items' ? 'outlined' : 'text'}
            disabled={contentType === 'items'}
            onClick={() => setContentTypeHandler('items')}
          >
            Items
          </TransButton>
          <TransButton
            variant={contentType === 'collections' ? 'outlined' : 'text'}
            disabled={contentType === 'collections'}
            onClick={() => setContentTypeHandler('collections')}
          >
            Collections
          </TransButton>
        </Box>
        <Box className="rounded border" p={2}>
          {contentType === 'items' && <ItemsList/>}
          {contentType === 'collections' && <CollectionsList/>}
        </Box>
      </Container>
    </Box>
  )
}
