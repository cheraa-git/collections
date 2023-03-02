import { Express } from "express"
import { authRouter } from "./routes/authRoutes"
import { collectionRouter } from "./routes/collectionRoutes"
import { itemRoutes } from "./routes/itemRoutes"
import { profileRouter } from "./routes/profileRoutes"
import { adminRouter } from "./routes/adminRoutes"
import { devRouter } from "./routes/devRoutes"

export class MainRouter {
  constructor(private app: Express) {
  }

  useRoutes() {
    this.app.use('/auth', authRouter)
    this.app.use('/collection', collectionRouter)
    this.app.use('/item', itemRoutes)
    this.app.use('/profile', profileRouter)
    this.app.use('/admin', adminRouter)
    this.app.use('/dev', devRouter)
  }
}
