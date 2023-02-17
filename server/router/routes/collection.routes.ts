'use strict'

import { Router } from "express"
import { CollectionController } from "../controller/collectionController"

const controller = new CollectionController()
export const collectionRouter = Router()

collectionRouter.post('/', controller.createCollection)
collectionRouter.patch('/', controller.editCollection)
collectionRouter.delete('/', controller.deleteCollection)
collectionRouter.get('/themes', controller.getThemes)
collectionRouter.get('/:id', controller.getCollection)



