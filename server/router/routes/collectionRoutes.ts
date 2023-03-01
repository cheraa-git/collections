'use strict'

import { Router } from "express"
import { CollectionController } from "../controller/collectionController"

const controller = new CollectionController()
export const collectionRouter = Router()

collectionRouter.post('/', controller.handleCreateCollection)
collectionRouter.patch('/', controller.handleEditCollection)
collectionRouter.delete('/', controller.handleDeleteCollection)
collectionRouter.get('/themes', controller.getThemes)
collectionRouter.get('/next', controller.handleGetNextCollections)
collectionRouter.get('/:id', controller.handleGetCollection)




