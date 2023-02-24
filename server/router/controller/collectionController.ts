import { Request, Response } from "express"
import { CreateCollectionBody, DeleteCollectionBody, EditCollectionBody, } from "../../../common/request-types"
import { checkToken } from "../../utils"
import { Themes } from "../../db/models/Themes"
import { createCollection, deleteCollection, editCollection, getCollection } from "../../service/collectionService"


export class CollectionController {

  handleCreateCollection = async (req: Request<any, any, CreateCollectionBody>, res: Response) => {
    const { token, itemConfigs, ...collection } = req.body
    const timestamp = `${Date.now()}`
    if (!checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    if (!collection.title || !collection.description || !collection.themeId) {
      return res.status(500).json({ error: 'Collection data is invalid' })
    }
    const newCollection = await createCollection({ ...collection, timestamp }, itemConfigs)
    res.json(newCollection)
  }


  handleGetCollection = async (req: Request, res: Response) => {
    const id = +req.params.id
    res.json(await getCollection(id))
  }

  handleDeleteCollection = async (req: Request<any, any, DeleteCollectionBody>, res: Response) => {
    const { collection, token } = req.body
    if (!checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    res.json(await deleteCollection(collection.id))
  }

  handleEditCollection = async (req: Request<any, any, EditCollectionBody>, res: Response) => {
    const { collection, token, itemConfigs } = req.body
    if (!checkToken(token, collection.userId)) {
      return res.status(500).json({ error: 'TokenError' })
    }
    res.json(await editCollection(collection, itemConfigs))
  }

  getThemes = async (req: Request, res: Response) => {
    res.json(await Themes.findAll())
  }
}
