import { Collections } from "../db/models/Collections"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { filterItem } from "../utils"
import { Either, left, right } from "@sweet-monads/either"
import { DbError } from "../../../common/errors/DbError"
import { EditCollectionResponse, GetCollectionResponse } from "../../../common/types/response-types"
import {
  cascadeDeleteItemConfigs,
  getCollectionsByItemCountQuery,
  getFullCollectionDataQuery
} from "./queries/collectionQueries"
import { removeCollectionRelationshipIndexes } from "./searchService"
import { Collection, ItemConfigType } from "../../../common/types/collection"
import { Item } from "../../../common/types/item"
import { EditCollectionBody } from "../../../common/types/request-body-types/collection-body"


interface CreateCollection {
  (collection: Omit<Collection, 'id'>, itemConfigs?: ItemConfigType[]): Promise<Either<DbError, Collections>>
}

export const createCollection: CreateCollection = async (collection, itemConfigs) => {
  try {
    const newCollection = await Collections.create(collection)
    if (itemConfigs && itemConfigs.length > 0) {
      const configs = itemConfigs.map(config => ({ ...config, collectionId: newCollection.id }))
      await ItemConfigs.bulkCreate(configs)
    }
    return right(newCollection.dataValues)
  } catch (e) {
    return left(new DbError('Create collection error', e))
  }
}

export const getCollection = async (id: number): Promise<Either<DbError, GetCollectionResponse | undefined>> => {
  try {
    const response = await getFullCollectionDataQuery(id)
    if (!response) return right(undefined)
    const collection = {
      ...response.dataValues,
      userName: response.users.nickname,
      itemConfigs: undefined, users: undefined, items: undefined
    }
    const items = response.items.map(i => ({ ...filterItem(i) } as Item))
    return right({ collection, itemConfigs: response.itemConfigs, items })
  } catch (e) {
    return left(new DbError('Get collection error', e))
  }
}

export const deleteCollection = async (id: number): Promise<Either<DbError, number>> => {
  try {
    await removeCollectionRelationshipIndexes(id)
    return right(await Collections.destroy({ where: { id }, force: true }))
  } catch (e) {
    return left(new DbError('Delete collection error'))
  }
}

interface EditCollection {
  (data: Omit<EditCollectionBody, 'token'>): Promise<Either<DbError, EditCollectionResponse>>
}

export const editCollection: EditCollection = async ({collection, removedConfigs, itemConfigs}) => {
  try {
    const editedCollection = await Collections.update(collection, { where: { id: collection.id }, returning: ['*'] })
    const editedConfigs = await ItemConfigs.bulkCreate(itemConfigs, {
      updateOnDuplicate: ['type', 'label', 'hidden'], returning: ['*']
    })
    await cascadeDeleteItemConfigs(removedConfigs)
    return right({ collection: editedCollection[1][0], itemConfigs: editedConfigs })
  } catch (e) {
    return left(new DbError('Edit collection error', e))
  }
}

export const getAllCollections = async (): Promise<Either<DbError, Collections[]>> => {
  try {
    return right(await Collections.findAll())
  } catch (e) {
    return left(new DbError('Get all collection error'))
  }
}

export const getNextCollections = async (offset: number, limit: number, themeId: number): Promise<Either<DbError, Collection[]>> => {
  try {
    const collections = (await getCollectionsByItemCountQuery({ offset, limit, themeId }))
      .map((w: any) => ({
          ...w.collections.dataValues,
          userNickname: w.collections.users.nickname,
          countItems: w.dataValues.count,
          users: undefined
        })
      )
    if (collections.length === 0) return right([])
    return right(collections)
  } catch (e) {
    return left(new DbError('getNextCollections: Error', e))
  }
}
