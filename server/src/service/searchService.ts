import { SearchClient } from "../apis/meilisearch"
import { Items } from "../db/models/Items"
import { filterItem } from "../utils"
import { getAllItems } from "./itemService"
import { Comments } from "../db/models/Comments"
import { getAllComments } from "./commentService"
import { Collections } from "../db/models/Collections"
import { getAllCollections } from "./collectionService"
import { Either, left } from "@sweet-monads/either"
import { IndexError } from "../../../common/errors/IndexError"
import { TaskStatus } from "meilisearch"

export const addItemIndex = (item: Items) => {
  const index = new SearchClient().index('items')
  index.addDocuments([filterItem(item)])
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const uploadItemIndex = (item: Items) => {
  const index = new SearchClient().index('items')
  index.updateDocuments([item])
    .catch(e => console.log('UPLOAD_INDEX_ERROR', e))
}

export const removeItemIndex = (itemId: number) => {
  const index = new SearchClient().index('items')
  index.deleteDocument(itemId)
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}


export const addCommentIndex = (comment: Comments) => {
  const index = new SearchClient().index('comments')
  index.addDocuments([comment.dataValues])
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const removeCommentIndex = (commentId: number) => {
  const index = new SearchClient().index('comments')
  index.deleteDocument(commentId)
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}

export const removeItemCommentsIndexes = async (itemId: number) => {
  const index = new SearchClient().index('comments')
  const itemCommentIds = (await Comments.findAll({ where: { itemId } })).map(comment => comment.id)
  index.deleteDocuments(itemCommentIds)
    .catch(e => console.log('DELETE_INDEXES_ERROR', e))
}


export const addCollectionIndex = (collection: Collections) => {
  const index = new SearchClient().index('collections')
  index.addDocuments([collection.dataValues])
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const uploadCollectionIndex = (collection: Collections) => {
  const index = new SearchClient().index('collections')
  index.updateDocuments([collection])
    .catch(e => console.log('UPLOAD_INDEX_ERROR', e))
}

export const removeCollectionIndex = (collectionId: number) => {
  const index = new SearchClient().index('collections')
  index.deleteDocument(collectionId)
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}

export const removeCollectionRelationshipIndexes = async (collectionId: number) => {
  const client = new SearchClient()
  const itemIndex = client.index('items')
  const commentIndex = client.index('comments')
  const itemIds = (await Items.findAll({ where: { collectionId } })).map(item => item.id)
  const commentIds = (await Comments.findAll({ where: { itemId: itemIds } })).map(comment => comment.id)
  itemIndex.deleteDocuments(itemIds)
    .catch(e => console.log('DELETE_INDEXES_ERROR', e))
  commentIndex.deleteDocuments(commentIds)
    .catch(e => console.log('DELETE_INDEXES_ERROR', e))
}

export const indexingAllItems = async (): Promise<Either<IndexError, { status: TaskStatus }>> => {
  try {
    const index = new SearchClient().index('items')
    await index.deleteAllDocuments()
    return (await getAllItems())
      .mapLeft(e => new IndexError('Get items error', e))
      .asyncMap(async (items) => {
        const response = await index.addDocuments(items.map(item => filterItem(item)))
        return { status: response.status }
      })
  } catch (e) {
    return left(new IndexError('Indexing all items error', e))
  }
}

export const indexingAllComments = async (): Promise<Either<IndexError, { status: TaskStatus }>> => {
  try {
    const index = new SearchClient().index('comments')
    await index.deleteAllDocuments()
    return (await getAllComments())
      .mapLeft(e => new IndexError('Get comments error', e))
      .asyncMap(async (comments) => {
        const response = await index.addDocuments(comments)
        return { status: response.status }
      })
  } catch (e) {
    return left(new IndexError('Indexing all comments error', e))
  }
}

export const indexingAllCollections = async (): Promise<Either<IndexError, { status: TaskStatus }>> => {
  try {
    const index = new SearchClient().index('collections')
    await index.deleteAllDocuments()
    return (await getAllCollections())
      .mapLeft(e => new IndexError('Get collections error', e))
      .asyncMap(async (collections) => {
        const response = await index.addDocuments(collections)
        return { status: response.status }
      })
  } catch (e) {
    return left(new IndexError('Indexing all collections error', e))
  }
}

