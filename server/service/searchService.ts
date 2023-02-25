import { SearchClient } from "../apis/meilisearch"
import { Items } from "../db/models/Items"
import { filterItem } from "../utils"
import { getAllItems } from "./itemService"
import { Comments } from "../db/models/Comments"
import { getAllComments } from "./CommentService"
import { Collections } from "../db/models/Collections"
import { getAllCollections } from "./collectionService"

export const addItemIndex = (item: Items) => {
  const index = new SearchClient().index('items')
  index.addDocuments([filterItem(item)])
    // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const uploadItemIndex = (item: Items) => {
  const index = new SearchClient().index('items')
  index.updateDocuments([item])
    // .then(e => console.log('UPLOAD_INDEX_SUCCESS', e))
    .catch(e => console.log('UPLOAD_INDEX_ERROR', e))
}

export const removeItemIndex = (itemId: number) => {
  const index = new SearchClient().index('items')
  index.deleteDocument(itemId)
    // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}

export const indexingAllItems = async () => {
  const index = new SearchClient().index('items')
  await index.deleteAllDocuments()
  const items = (await getAllItems()).map(item => filterItem(item))
  await index.addDocuments(items)
}

export const addCommentIndex = (comment: Comments) => {
  const index = new SearchClient().index('comments')
  index.addDocuments([comment.dataValues])
    // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const removeCommentIndex = (commentId: number) => {
  const index = new SearchClient().index('items')
  index.deleteDocument(commentId)
    // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}

export const indexingAllComments = async () => {
  const index = new SearchClient().index('comments')
  await index.deleteAllDocuments()
  await index.addDocuments(await getAllComments())
}

export const addCollectionIndex = (collection: Collections) => {
  const index = new SearchClient().index('collections')
  index.addDocuments([collection.dataValues])
    // .then(e => console.log('CREATE_INDEX_SUCCESS', e))
    .catch(e => console.log('CREATE_INDEX_ERROR', e))
}

export const uploadCollectionIndex = (collection: Collections) => {
  const index = new SearchClient().index('collections')
  index.updateDocuments([collection])
    // .then(e => console.log('UPLOAD_INDEX_SUCCESS', e))
    .catch(e => console.log('UPLOAD_INDEX_ERROR', e))
}

export const removeCollectionIndex = (collectionId: number) => {
  const index = new SearchClient().index('collections')
  index.deleteDocument(collectionId)
    // .then(e => console.log('DELETE_INDEX_SUCCESS', e))
    .catch(e => console.log('DELETE_INDEX_ERROR', e))
}

export const indexingAllCollections = async () => {
  const index = new SearchClient().index('collections')
  await index.deleteAllDocuments()
  await index.addDocuments(await getAllCollections())
}

