'use strict'

import { Router } from "express"
import { ProfileController } from "../controller/profileController"

const controller = new ProfileController()
export const profileRouter = Router()

profileRouter.post('/confirm_edit', controller.handleSendConfirmationEmail)
profileRouter.post('/edit_by_token', controller.handleEditProfileByToken)
profileRouter.post('/edit_by_provider', controller.handleEditProfileByProvider)
profileRouter.patch('/edit_avatar', controller.handleEditAvatar)
profileRouter.get('/:userId', controller.handleGetProfile)



