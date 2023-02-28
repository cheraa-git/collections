import { Request, Response } from "express"
import { editProfile, getProfile } from "../../service/profileService"
import { EditProfileBody } from "../../../common/request-types"
import { checkLoginData } from "../../service/authService"
import { sendConfirmProfileChange } from "../../service/emailService"


export class ProfileController {

  async handleGetProfile(req: Request, res: Response) {
    const userId = +req.params.userId
    const response = await getProfile(userId)
    response
      .mapRight(profile => res.json(profile))
      .mapLeft(e => res.status(500).json(e))
  }

  async handleSendConfirmationEmail(req: Request<any, any, EditProfileBody>, res: Response) {
    const { oldEmail, oldPassword, ...newUserData } = req.body
    const authResponse = await checkLoginData(oldEmail, oldPassword)
    authResponse
      .mapLeft(e => res.status(401).json(e))
      .mapRight(async () => {
        (await sendConfirmProfileChange({ ...newUserData, oldEmail }))
          .mapLeft(e => res.status(500).json(e))
      })
  }

  async handleEditProfile({ body: { token } }: Request, res: Response) {
    (await editProfile(token))
      .mapRight(userId => res.json(userId))
      .mapLeft(e => res.status(500).json(e))
  }
}



