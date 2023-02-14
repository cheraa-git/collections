import { FC } from "react"
import { Button } from "@mui/material"
import { Item } from "../../../../common/common-types"
import { Link } from "react-router-dom"

interface ItemCardProps {
  item: Item
}

export const ItemCard: FC<ItemCardProps> = ({ item }) => {
  const tags = ['book', 'learn', 'library', 'favorite_book', 'advice']
  return (
    <div className="shadow flex py-2 px-4">
      <p className="mr-4 font-bold">{item.name}</p>
      {tags.map(tag => <Link key={tag} to="#" className="mx-2  underline text-orange-400">#{tag}</Link>)}
      <div className="ml-auto">
        <Link to={`/collection/${item.collectionId}/${item.id}`}>
          <Button size="small">Open</Button>
        </Link>
      </div>
    </div>
  )
}
