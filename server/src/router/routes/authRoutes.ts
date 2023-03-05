'use strict'

import { Router } from "express"
import AuthController from '../controller/authController'

const controller = new AuthController()
export const authRouter = Router()

authRouter.post('/login', controller.handleLogin)
authRouter.post('/confirm_register', controller.handleSendConfirmEmail)
authRouter.post('/register', controller.handleRegister)
authRouter.post('/autologin', controller.handleAutoLogin)
authRouter.post('/provider', controller.handleAuthByProvider)


