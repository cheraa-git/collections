import { Request, Response } from "express"
import { getProfile } from "../../service/profileService"


export class ProfileController {

  async handleGetProfile(req: Request, res: Response) {
    const userId = +req.params.userId
    const response = await getProfile(userId)
    response
      .mapRight(profile => res.json(profile))
      .mapLeft(e => res.status(500).json(e))
  }
}



