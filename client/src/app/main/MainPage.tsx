import { FC, useState } from "react"
import { Box, Container } from "@mui/material"
import { ItemsList } from "./ItemsList"
import { CollectionsList } from "./CollectionsList"
import { TransButton } from "../../common/TransButton"


export const MainPage: FC = () => {
  const [contentType, setContentType] = useState<'items' | 'collections'>('items')

  return (
    <Box my={2}>
      <Container maxWidth="lg" className="">
        <Box width="max-content" ml="auto">
          <TransButton
            variant={contentType === 'items' ? 'outlined' : 'text'}
            disabled={contentType === 'items'}
            onClick={() => setContentType('items')}
          >
            Items
          </TransButton>
          <TransButton
            variant={contentType === 'collections' ? 'outlined' : 'text'}
            disabled={contentType === 'collections'}
            onClick={() => setContentType('collections')}
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
