import { FC } from "react"
import { Collection } from "../../../../common/common-types"
import { ProfileUser } from "../../types/user"
import { formatDate } from "../../utils"
import MDEditor from "@uiw/react-md-editor"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useCollection } from "../../hooks/collectionStateHook"

interface CollectionCardProps {
  collection: Collection
  user: ProfileUser
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, user }) => {
  const { getThemeName } = useCollection()

  return (
    <div className="bg-white max-w-[900px] w-[100%] rounded p-4">
      <div className="mb-2 border-b">
        <div className="flex justify-between">
          <h2>{collection.title}</h2>
          <p className="self-end text-gray-600 w-max text-end">{formatDate(collection.timestamp)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-orange-400 cursor-pointer capitalize">@{user.nickname}</p>
          <p className="text-blue-500 underline cursor-pointer text">{getThemeName(collection.themeId)}</p>
        </div>
      </div>
      <img src={collection.imageUrl} alt="collection" hidden={!collection.imageUrl}/>
      <div data-color-mode="light" className="max-h-[200px] overflow-auto my-3">
        <MDEditor.Markdown source={collection.description}/>
      </div>
      <Link to={`/collection/${collection.id}`}><Button>Open</Button></Link>
    </div>
  )
}
