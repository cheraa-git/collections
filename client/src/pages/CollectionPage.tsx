import { FC, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { getCollection } from "../store/actions/collectionActions"
import { Link, useParams } from "react-router-dom"

export const CollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const { collection } = useAppSelector((state: RootState) => state.collection)
  const { id } = useParams()
  const createdDate = '11:23 02/02/2023'

  useEffect(() => {
    if (id) {
      dispatch(getCollection(id))
    }
  }, [dispatch])

  return (
    <div className="bg-white max-w-5xl mx-auto my-5 rounded p-5">
      <div className="sm:flex border-b pb-2 mb-2">
        <img className="h-max sm:w-[300px] w-max my-auto max-h-[50vh]" src={collection.imageUrl}
             alt="collection-image"/>
        <div className="sm:px-3">
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
        </div>
      </div>

      <div className="border-b pb-2 mb-2">
        <h3>Theme: {collection.theme}</h3>
        <p className="italic">
          Created by <Link to={`/profile/${collection.userId}`} className="text-orange-400">@{collection.userName}</Link> in <span>{createdDate}</span>
        </p>
      </div>
    </div>
  )
}
