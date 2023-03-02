import { Items } from "../../db/models/Items"
import { Tags } from "../../db/models/Tags"
import { Sequelize } from "sequelize-typescript"
import { Collections } from "../../db/models/Collections"
import { Users } from "../../db/models/Users"
import { ItemsTags } from "../../db/models/ItemsTags"

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

export const _getCollectionsByItemCountQuery = async (params: { offset?: number, limit?: number, themeId: number }) => {
  return await Items.findAll({
    offset: params.offset,
    limit: params.limit,
    attributes: [[Sequelize.fn('count', Sequelize.col('collectionId')), 'count']],
    include: [{
      model: Collections,
      where: params.themeId ? { themeId: params.themeId } : undefined,
      attributes: ['title', 'description', 'themeId', 'imageUrl', 'timestamp', 'id'],
      include: [{ model: Users, attributes: ['nickname'] }]
    }],
    group: ['Items.collectionId', 'collections.id', 'collections.users.id'],
    order: Sequelize.literal('count DESC'),
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
