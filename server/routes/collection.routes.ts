'use strict'

import { Router } from "express"
import { CollectionController } from "../controller/collection.controller"

const controller = new CollectionController()
export const collectionRouter = Router()

collectionRouter.post('/create_collection', controller.createCollection)
collectionRouter.post('/create_item', controller.createItem)
collectionRouter.post('/edit_item', controller.editItem)
collectionRouter.get('/:id', controller.getCollection)
collectionRouter.get('/:collectionId/:id', controller.getItem)
collectionRouter.delete('/delete_item', controller.deleteItem)
collectionRouter.delete('/delete_collection', controller.deleteCollection)
collectionRouter.post('/edit_collection', controller.editCollection)



