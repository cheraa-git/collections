'use strict'

import { Router } from "express"
import { ItemController } from "../controller/itemController"

const controller = new ItemController()
export const itemRouter = Router()

itemRouter.post('/', controller.handlerCreateItem)
itemRouter.patch('/', controller.handleEditItem)
itemRouter.delete('/', controller.handleDeleteItem)
itemRouter.get('/tags', controller.getTags)
itemRouter.get('/:collectionId/:id', controller.handleGetItem)



