import { Request, Response } from "express"
import { CreateCollectionBody, DeleteCollectionBody, EditCollectionBody, } from "../../../../common/request-types"
import { Themes } from "../../db/models/Themes"
import {
  createCollection,
  deleteCollection,
  editCollection,
  getCollection,
  getNextCollections
} from "../../service/collectionService"
import { checkToken } from "../../service/tokenService"
import { TokenError } from "../../../../common/errors/TokenError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { Theme } from "../../../../common/common-types"
import { Sequelize } from "sequelize"


export class CollectionController {

  handleCreateCollection = async (req: Request<any, any, CreateCollectionBody>, res: Response) => {
    const { token, itemConfigs, ...collection } = req.body
    const timestamp = `${Date.now()}`
    if (!checkToken(token, collection.userId)) return res.status(500).json(new TokenError())
    return (await createCollection({ ...collection, timestamp }, itemConfigs))
      .mapRight(newCollection => res.json(newCollection))
      .mapLeft(e => res.status(500).json(e))
  }

  handleGetCollection = async (req: Request, res: Response) => {
    const id = +req.params.id
    return (await getCollection(id))
      .mapRight(data => res.json(data))
      .mapLeft(e => res.status(500).json(e))
  }

  handleDeleteCollection = async (req: Request<any, any, DeleteCollectionBody>, res: Response) => {
    const { collection, token } = req.body
    if (!checkToken(token, collection.userId)) return res.status(500).json(new TokenError())
    return (await deleteCollection(collection.id))
      .mapRight(n => res.json(n))
      .mapLeft(e => res.status(500).json(e))
  }

  handleEditCollection = async (req: Request<any, any, EditCollectionBody>, res: Response) => {
    const { collection, token, itemConfigs } = req.body
    if (!checkToken(token, collection.userId)) return res.status(500).json(new TokenError())
    return (await editCollection(collection, itemConfigs))
      .mapRight(data => res.json(data))
      .mapLeft(e => res.status(500).json(e))
  }

  getThemes = async (req: Request, res: Response<Theme[] | DatabaseError>) => {
    try {
      res.json(await Themes.findAll({order: Sequelize.literal('name')}))
    } catch (e) {
      res.status(500).json(new DatabaseError('Get themes', e))
    }
  }

  async handleGetNextCollections({ query: { offset, limit, themeId } }: Request, res: Response) {
    if (!offset || !limit) return res.json([])
    const collectionsResponse = await getNextCollections(Number(offset), Number(limit), Number(themeId))
    collectionsResponse
      .mapRight(items => res.json(items))
      .mapLeft(e => res.status(500).json(e))
  }
}
