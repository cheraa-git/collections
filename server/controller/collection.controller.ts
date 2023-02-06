import { Request, Response } from "express"
import * as jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"
import { Collections } from "../db/models/Collections"
import { ItemConfigs } from "../db/models/ItemConfigs"
import { config } from "dotenv"
import { CreateCollectionBody } from "../../common/request-types"
import { Users } from "../db/models/Users"

config()
const SECRET_KEY = process.env.TOKEN_SECTET_KEY + ''

export class CollectionController {

  async createCollection(req: Request<any, any, CreateCollectionBody>, res: Response) {
    const { userId, token, title, description, theme, imageUrl, itemConfigs } = req.body
    const jwtPayload = jwt.verify(token, SECRET_KEY) as JwtPayload
    if (jwtPayload.id !== userId) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!title || !description || !theme) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newCollection = await Collections.create({ title, description, theme, userId, imageUrl })
    if (itemConfigs && itemConfigs.length > 0) {
      const configs = itemConfigs.map(config => ({ ...config, collectionId: newCollection.id }))
      await ItemConfigs.bulkCreate(configs)
    }
    // TODO: отработать исключения при создании
    res.json({ ...newCollection.dataValues })
  }


  async getCollection(req: Request, res: Response) {
    const id = +req.params.id
    const response = await Collections.findOne({
      where: { id },
      include: [
        { model: ItemConfigs },
        {
          model: Users,
          attributes: ['nickname']
        }]
    })
    const collection = {
      ...response?.dataValues,
      userName: response?.users.nickname,
      itemConfigs: undefined,
      users: undefined,
    }
    const itemConfigs = response?.itemConfigs
    res.json({ collection, itemConfigs })
  }
}
