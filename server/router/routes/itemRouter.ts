'use strict'

import { Router } from "express"
import { ItemController } from "../controller/itemController"

const controller = new ItemController()
export const itemRouter = Router()

itemRouter.post('/', controller.createItem)
itemRouter.patch('/', controller.editItem)
itemRouter.delete('/', controller.deleteItem)
itemRouter.get('/:collectionId/:id', controller.getItem)



