import { Request, Response } from "express"
import { Collections } from "../../db/models/Collections"
import { Users } from "../../db/models/Users"
import { GetProfileResponse } from "../../../common/response-types"


export class ProfileController {

  async getProfile(req: Request, res: Response<GetProfileResponse>) {
    const userId = req.params.userId
    const collections = await Collections.findAll({ where: { userId } })
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ['id', 'nickname', 'avatarUrl']
    })
    res.json({ collections, user: user?.dataValues })
  }

}



