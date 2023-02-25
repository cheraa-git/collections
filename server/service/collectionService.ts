import { Collections } from "../db/models/Collections"
import { Collection, ItemConfigType } from "../../common/common-types"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { Users } from "../db/models/Users"
import { Items } from "../db/models/Items"
import { Tags } from "../db/models/Tags"
import { filterItem } from "../utils"


export const createCollection = async (collection: Omit<Collection, 'id'>, itemConfigs?: ItemConfigType[]) => {
  const newCollection = await Collections.create(collection)
  if (itemConfigs && itemConfigs.length > 0) {
    const configs = itemConfigs.map(config => ({ ...config, collectionId: newCollection.id }))
    await ItemConfigs.bulkCreate(configs)
  }
  return newCollection.dataValues
}

export const getCollection = async (id: number) => {
  const response = await Collections.findOne({
    where: { id },
    include: [
      { model: ItemConfigs },
      { model: Users, attributes: ['nickname'] },
      { model: Items, include: [{ model: Tags, through: { attributes: [] } }] }
    ]
  })
  const collection = {
    ...response?.dataValues,
    userName: response?.users.nickname,
    itemConfigs: undefined, users: undefined, items: undefined
  }
  const items = response?.items.map(i => ({ ...filterItem(i), userId: response?.userId }))
  return { collection, itemConfigs: response?.itemConfigs, items }
}

export const deleteCollection = async (id: number) => {
  return await Collections.destroy({ where: { id }, force: true })
}

export const editCollection = async (collection: Collection, itemConfigs: ItemConfigType[]) => {
  const editedCollection = await Collections.update(collection, { where: { id: collection.id }, returning: ['*'] })
  const editedConfigs = await ItemConfigs.bulkCreate(itemConfigs, {
    updateOnDuplicate: ['type', 'label'],
    returning: ['*']
  })
  return { collection: editedCollection[1][0], itemConfigs: editedConfigs }
}

export const getAllCollections = async () => {
  return await Collections.findAll()
}
