import { Items } from "../db/models/Items"
import { filterItem } from "../utils"
import { Fields, Item, Tag } from "../../common/common-types"
import { Tags } from "../db/models/Tags"
import { ItemsTags } from "../db/models/ItemsTags"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { Collections } from "../db/models/Collections"


const createItemTags = async (tags: Tag[], itemId: number): Promise<Tag[]> => {
  const addedTags = tags.filter(tag => tag.id)
  const createdTags = (await Tags.bulkCreate(tags.filter(tag => !tag.id))).map(tag => tag.dataValues)
  const itemTags = [...addedTags, ...createdTags].map(tag => ({ itemId, tagId: tag.id }))
  await ItemsTags.bulkCreate(itemTags)
  return [...addedTags, ...createdTags]
}

const editItemTags = async (tags: Tag[], itemId: number) => {
  await ItemsTags.destroy({ where: { itemId } })
  await createItemTags(tags, itemId)
  return tags
}

export const createItem = async (userId: number, collectionId: number, fields: Fields, tags: Tag[]) => {
  const timestamp = `${Date.now()}`
  const newItem = await Items.create({ collectionId, timestamp, ...fields })
  return { ...filterItem(newItem), tags: await createItemTags(tags, newItem.id), userId }
}

export const getItem = async (itemId: number) => {
  const item = await Items.findOne({ where: { id: itemId }, include: [{ model: Tags, through: { attributes: [] } }] })
  const itemConfigs = await ItemConfigs.findAll({ where: { collectionId: item?.collectionId } })
  const userId = (await Collections.findOne({ where: { id: item?.collectionId }, attributes: ['userId'] }))?.userId
  return { item: { ...filterItem(item), userId }, itemConfigs }
}

export const getItemAuthorId = async (collectionId: number) => {
  const response = await Collections.findOne({ where: { id: collectionId }, attributes: ['userId'] })
  return response?.userId
}

export const editItem = async (item: Item) => {
  const { tags, ...editingItem } = item
  const updatedItem = await Items.update(editingItem, { where: { id: editingItem.id }, returning: ['*'] })
  const updatedTags = await editItemTags(tags, editingItem.id)
  return { ...filterItem(updatedItem[1][0]), tags: updatedTags }
}

export const deleteItem = async (id: number) => {
  return await Items.destroy({ where: { id }, force: true })
}

export const getAllItems = async () => {
  return await Items.findAll()
}
