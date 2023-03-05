import { Items } from "../db/models/Items"
import { filterItem } from "../utils"
import { ItemsTags } from "../db/models/ItemsTags"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { Collections } from "../db/models/Collections"
import { Either, left, right } from "@sweet-monads/either"
import { DbError } from "../../../common/errors/DbError"
import { GetItemResponse } from "../../../common/types/response-types"
import { NotFoundError } from "../../../common/errors/NotFoundError"
import { Users } from "../db/models/Users"
import {
  createTagsQuery,
  getItemWithTagsQuery,
  getMostPopularTagsQuery,
  getRangeItemsQuery
} from "./queries/itemQueries"
import { removeItemCommentsIndexes } from "./searchService"
import { Fields, Item, Tag, TagCount } from "../../../common/types/item"


const createItemTags = async (tags: Tag[], itemId: number): Promise<Either<DbError, Tag[]>> => {
  try {
    const addedTags = tags.filter(tag => tag.id)
    const createdTags = await createTagsQuery(tags.filter(tag => !tag.id))
    const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }))
    await ItemsTags.bulkCreate(itemTags)
    return right([...addedTags, ...createdTags])
  } catch (e) {
    return left(new DbError('Create item tags error', e))
  }
}

const editItemTags = async (tags: Tag[], itemId: number): Promise<Either<DbError, Tag[]>> => {
  try {
    await ItemsTags.destroy({ where: { itemId } })
    const response = await createItemTags(tags, itemId)
    return response.map(() => tags)
  } catch (e) {
    return left(new DbError('Edit item tags error', e))
  }
}

interface CreateItem {
  (userId: number, collectionId: number, fields: Fields, tags: Tag[]): Promise<Either<DbError, Item>>
}

export const createItem: CreateItem = async (userId, collectionId, fields, tags) => {
  try {
    const timestamp = `${Date.now()}`
    const newItem = await Items.create({ collectionId, timestamp, ...fields })
    const newTagsResponse = await createItemTags(tags, newItem.id)
    return newTagsResponse.map(newTags => ({ ...filterItem(newItem), tags: newTags } as Item))
  } catch (e) {
    console.log(e)
    return left(new DbError('Create item error', e))
  }
}


export const getItem = async (itemId: number): Promise<Either<DbError | NotFoundError, GetItemResponse>> => {
  try {
    const item = await getItemWithTagsQuery({ itemId })
    if (!item) return left(new NotFoundError(`Item number ${itemId} not found`))
    const itemConfigs = await ItemConfigs.findAll({ where: { collectionId: item?.collectionId } })
    const user = (await Collections.findOne({ where: { id: item.collectionId }, include: Users }))?.users
    return right({ item: { ...filterItem(item), userId: user?.id, userNickname: user?.nickname } as Item, itemConfigs })
  } catch (e) {
    console.log('item', e)
    return left(new DbError('Get item error', e))
  }
}

export const getItemAuthorId = async (collectionId: number): Promise<number | undefined> => {
  try {
    const response = await Collections.findOne({ where: { id: collectionId }, attributes: ['userId'] })
    return response?.userId
  } catch (e) {
    return undefined
  }
}

export const editItem = async (item: Item): Promise<Either<DbError, Item>> => {
  try {
    const { tags, ...editingItem } = item
    const updatedItem = await Items.update(editingItem, { where: { id: editingItem.id }, returning: ['*'] })
    const user = (await Collections.findOne({ where: { id: item.collectionId }, include: Users }))?.users
    const updatedTagsResponse = (await editItemTags(tags, editingItem.id))
    return updatedTagsResponse.map(updatedTags => ({
      ...filterItem(updatedItem[1][0]), tags: updatedTags, userId: user?.id, userNickname: user?.nickname
    } as Item))
  } catch (e) {
    return left(new DbError('Edit item error', e))
  }
}

export const deleteItem = async (id: number): Promise<Either<DbError, number>> => {
  try {
    await removeItemCommentsIndexes(id)
    return right(await Items.destroy({ where: { id }, force: true }))
  } catch (e) {
    return left(new DbError('Delete item error', e))
  }
}

export const getAllItems = async (): Promise<Either<DbError, Items[]>> => {
  try {
    return right(await Items.findAll())
  } catch (e) {
    return left(new DbError('Delete item error', e))
  }
}

export const getNextItems = async (offset: number, limit: number, tagIds?: number[]): Promise<Either<DbError, Item[]>> => {
  try {
    const items = (await getRangeItemsQuery({ offset, limit, tagIds }))
      .map(item => ({ ...item.dataValues, collections: undefined, collectionTitle: item.collections.title }))
    if (items.length === 0) return right([])
    return right(items.map(item => (filterItem(item) as Item)))
  } catch (e) {
    console.log(e)
    return left(new DbError('getNextItems: Error', e))
  }
}

export const getMostPopularTags = async (): Promise<Either<DbError, TagCount[]>> => {
  try {
    const countTags: TagCount[] = (await getMostPopularTagsQuery()).map(countTag => ({
      tagId: countTag.tagId,
      count: +countTag.dataValues.count,
    }))
    return right(countTags)
  } catch (e) {
    console.log(e)
    return left(new DbError('getMostPopularTags: Error', e))
  }
}
