import { Items } from "../../db/models/Items"
import { Tags } from "../../db/models/Tags"
import { Sequelize } from "sequelize-typescript"
import { ItemsTags } from "../../db/models/ItemsTags"
import { Tag } from "../../../../common/types/item"
import { Collections } from "../../db/models/Collections"

export const getRangeItemsQuery = async (params: { offset: number, limit: number, tagIds?: number[] }) => {
  return await Items.findAll({
    offset: params.offset,
    limit: params.limit,
    include: [
      {
        model: Tags,
        through: { attributes: [] },
        where: (params.tagIds && params.tagIds.length > 0) ? { id: params.tagIds } : undefined,
      },
      {
        model: Collections,
        attributes: ['title']
      }
    ],
    order: [Sequelize.literal('timestamp DESC')]
  })
}

export const getItemWithTagsQuery = async (params: { itemId: number }) => {
  return await Items.findOne({
    where: { id: params.itemId },
    include: {
      model: Tags,
      through: { attributes: [] }
    }
  })
}


export const getMostPopularTagsQuery = async () => {

  return ItemsTags.findAll({
    limit: 30,
    attributes: [
      'tagId',
      [Sequelize.fn('count', Sequelize.col('tagId')), 'count'],
    ],
    group: ['ItemsTags.tagId'],
    order: Sequelize.literal('count DESC')
  })
}

export const createTagsQuery = async (tags: Tag[]) => {
  if (tags.length === 0) return []
  try {
    return await Tags.bulkCreate(tags)
  } catch (e: any) {
    if (e?.name === 'SequelizeUniqueConstraintError') {
      const existTags = await Tags.findAll({ where: { name: tags.map(tag => tag.name) } })
      const uniqueTags = tags.filter(tag => !existTags.find(existTag => existTag.name === tag.name))
      const createdTags = await Tags.bulkCreate(uniqueTags)
      return [...createdTags, ...existTags]
    }
    return []
  }
}
