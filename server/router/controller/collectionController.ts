import { Request, Response } from "express"
import { Collections } from "../../db/models/Collections"
import { ItemConfigs } from "../../db/models/ItemConfigs"
import { CreateCollectionBody, DeleteCollectionBody, EditCollectionBody, } from "../../../common/request-types"
import { Users } from "../../db/models/Users"
import { Items } from "../../db/models/Items"
import { checkToken, filterItem } from "../../utils"
import { Themes } from "../../db/models/Themes"
import { Tags } from "../../db/models/Tags"


export class CollectionController {

  createCollection = async (req: Request<any, any, CreateCollectionBody>, res: Response) => {
    const { userId, token, title, description, themeId, imageUrl, itemConfigs } = req.body
    const timestamp = `${Date.now()}`
    if (!checkToken(token, userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!title || !description || !themeId) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newCollection = await Collections.create({ title, description, themeId, userId, imageUrl, timestamp })
    if (itemConfigs && itemConfigs.length > 0) {
      const configs = itemConfigs.map(config => ({ ...config, collectionId: newCollection.id }))
      await ItemConfigs.bulkCreate(configs)
    }
    //TODO: отработать исключения при создании
    res.json({ ...newCollection.dataValues })
  }


  getCollection = async (req: Request, res: Response) => {
    const id = +req.params.id
    const response = await Collections.findOne({
      where: { id },
      include: [
        { model: ItemConfigs },
        { model: Users, attributes: ['nickname'] },
        { model: Items, include: [{ model: Tags, through: { attributes: [] } }]  }
      ]
    })
    const collection = {
      ...response?.dataValues,
      userName: response?.users.nickname,
      itemConfigs: undefined,
      users: undefined,
      items: undefined
    }
    const items = response?.items.map(i => filterItem(i))
    res.json({ collection, itemConfigs: response?.itemConfigs, items })
  }

  deleteCollection = async (req: Request<any, any, DeleteCollectionBody>, res: Response) => {
    const { collection, token } = req.body
    if (checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const countDeletedCollections = await Collections.destroy({ where: { id: collection.id }, force: true })
    res.json(countDeletedCollections)
  }

  editCollection = async (req: Request<any, any, EditCollectionBody>, res: Response) => {
    const { collection, token, itemConfigs } = req.body
    if (!checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    const editedCollection = await Collections.update(collection, { where: { id: collection.id }, returning: ['*'] })
    console.log('ITEM_CONFIGS', itemConfigs)
    const editedConfigs = await ItemConfigs.bulkCreate(itemConfigs, {
      updateOnDuplicate: ['type', 'label'],
      returning: ['*']
    })

    res.json({ collection: editedCollection[1][0], itemConfigs: editedConfigs })
  }

  getThemes = async (req: Request, res: Response) => {
    const themes = await Themes.findAll()
    res.json(themes)
  }
}
