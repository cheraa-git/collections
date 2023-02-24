import { Request, Response } from "express"
import { GetProfileResponse } from "../../../common/response-types"
import { getProfile } from "../../service/profileService"


export class ProfileController {

  async handleGetProfile(req: Request, res: Response<GetProfileResponse>) {
    const userId = +req.params.userId
    const profile = await getProfile(userId)
    res.json(profile)
  }

}



