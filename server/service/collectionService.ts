import { Collections } from "../db/models/Collections"
import { Collection, Item, ItemConfigType } from "../../common/common-types"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { Users } from "../db/models/Users"
import { Items } from "../db/models/Items"
import { Tags } from "../db/models/Tags"
import { filterItem } from "../utils"
import { Either, left, right } from "@sweet-monads/either"
import { DatabaseError } from "../../common/errors/DatabaseError"
import { EditCollectionResponse, GetCollectionResponse } from "../../common/response-types"
import { getCollectionsByItemCountQuery } from "./queries/collectionQueries"


interface CreateCollection {
  (collection: Omit<Collection, 'id'>, itemConfigs?: ItemConfigType[]): Promise<Either<DatabaseError, Collections>>
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
    return left(new DatabaseError('Create collection error', e))
  }
}

export const getCollection = async (id: number): Promise<Either<DatabaseError, GetCollectionResponse | undefined>> => {
  try {
    const response = (await Collections.findOne({
      where: { id },
      include: [
        { model: ItemConfigs },
        { model: Users },
        { model: Items, include: [{ model: Tags, through: { attributes: [] } }] }
      ]
    }))
    if (!response) return right(undefined)
    const collection = {
      ...response.dataValues,
      userName: response.users.nickname,
      itemConfigs: undefined, users: undefined, items: undefined
    }
    const items = response.items.map(i => ({ ...filterItem(i) } as Item))
    return right({ collection, itemConfigs: response.itemConfigs, items })
  } catch (e) {
    return left(new DatabaseError('Get collection error', e))
  }
}

export const deleteCollection = async (id: number): Promise<Either<DatabaseError, number>> => {
  try {
    return right(await Collections.destroy({ where: { id }, force: true }))
  } catch (e) {
    return left(new DatabaseError('Delete collection error'))
  }
}

interface EditCollection {
  (collection: Omit<Collection, 'timestamp'>, itemConfigs: ItemConfigType[]): Promise<Either<DatabaseError, EditCollectionResponse>>
}

export const editCollection: EditCollection = async (collection, itemConfigs) => {
  try {
    const editedCollection = await Collections.update(collection, { where: { id: collection.id }, returning: ['*'] })
    const editedConfigs = await ItemConfigs.bulkCreate(itemConfigs, {
      updateOnDuplicate: ['type', 'label'], returning: ['*']
    })
    return right({ collection: editedCollection[1][0], itemConfigs: editedConfigs })
  } catch (e) {
    return left(new DatabaseError('Edit collection error', e))
  }
}

export const getAllCollections = async (): Promise<Either<DatabaseError, Collections[]>> => {
  try {
    return right(await Collections.findAll())
  } catch (e) {
    return left(new DatabaseError('Get all collection error'))
  }
}

export const getNextCollections = async (offset: number, limit: number, themeId: number): Promise<Either<DatabaseError, Collection[]>> => {
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
    return left(new DatabaseError('getNextCollections: Error', e))
  }
}
