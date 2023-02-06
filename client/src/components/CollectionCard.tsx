import { FC } from "react"
import { Collection } from "../../../common/common-types"
import { ProfileUser } from "../types/user"
import { truncate } from "../utils"

interface CollectionCardProps {
  collection: Collection
  user: ProfileUser
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, user }) => {
  const creationDate = '11:23 02/02/2023'



  return (
    <div className="bg-white max-w-[900px] w-[100%] rounded p-4">
      <div className="mb-2 border-b">
        <div className="flex justify-between">
          <h2 >{collection.title}</h2>
          <p className="self-end text-gray-600 w-max text-end">{creationDate}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-orange-400 cursor-pointer capitalize">@{user.nickname}</p>
          <p className="text-blue-500 underline cursor-pointer text">{collection.theme}</p>
        </div>
      </div>
      <img src={collection.imageUrl} alt="collection" hidden={!collection.imageUrl}/>
      <p className="">{truncate(collection.description, 500)}</p>
    </div>
  )
}
