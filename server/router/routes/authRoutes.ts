'use strict'

import { Router } from "express"
import AuthController from '../controller/authController'

const controller = new AuthController()
export const authRouter = Router()

authRouter.post('/login', controller.loginUser)
authRouter.post('/register', controller.handleRegisterUser)
authRouter.post('/autologin', controller.autoLogin)


