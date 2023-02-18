import { FC } from "react"
import { Button } from "@mui/material"
import { Item } from "../../../../common/common-types"
import { Link } from "react-router-dom"
import { TagChip } from "../TagChip"

interface ItemCardProps {
  item: Item
}

export const ItemCard: FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="shadow flex py-2 px-4 relative">
      <p className="mr-4 font-bold self-center">{item.name}</p>
      <div className="flex overflow-x-scroll mr-7">
        {item.tags?.map(tag => <TagChip key={tag.id} tag={tag}/>)}
      </div>
      <div className="ml-auto absolute right-0 bg-gradient-to-l from-white via-white to-[#FFFFFF91]">
        <Link to={`/collection/${item.collectionId}/${item.id}`}>
          <Button size="small">Open</Button>
        </Link>
      </div>
    </div>
  )
}
