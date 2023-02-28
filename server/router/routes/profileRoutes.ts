'use strict'

import { Router } from "express"
import { ProfileController } from "../controller/profileController"

const controller = new ProfileController()
export const profileRouter = Router()

profileRouter.post('/confirm_edit', controller.handleSendConfirmationEmail)
profileRouter.post('/edit', controller.handleEditProfile)
profileRouter.get('/:userId', controller.handleGetProfile)



