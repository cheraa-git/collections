'use strict'

import { Router } from "express"
import AdminController from "../controller/adminController"

const controller = new AdminController()
export const adminRouter = Router()

adminRouter.get('/users', controller.handleGetUsers)
adminRouter.post('/users/status', controller.handleSetUsersStatus)
adminRouter.post('/users/admin_status', controller.handleSetAdminStatus)


