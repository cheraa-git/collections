import { Request, Response } from "express"
import { editAvatar, editProfileByProvider, editProfileByToken, getProfile } from "../../service/profileService"
import { EditProfileByProviderBody, EditProfileByTokenBody } from "../../../../common/types/request-types"
import { checkLoginData } from "../../service/authService"
import { sendProfileChangeConfirm } from "../../service/emailService"
import { checkToken } from "../../service/tokenService"
import { TokenError } from "../../../../common/errors/TokenError"


export class ProfileController {

  async handleGetProfile(req: Request, res: Response) {
    const userId = +req.params.userId
    const response = await getProfile(userId)
    response
      .mapRight(profile => res.json(profile))
      .mapLeft(e => res.status(500).json(e))
  }

  async handleSendConfirmationEmail(req: Request<any, any, EditProfileByTokenBody>, res: Response) {
    const { oldEmail, oldPassword, ...newDataOfUser } = req.body
    const authResponse = await checkLoginData(oldEmail, oldPassword)
    authResponse
      .mapLeft(e => res.status(401).json(e))
      .mapRight(async () => {
        (await sendProfileChangeConfirm({ ...newDataOfUser, oldEmail }))
          .mapLeft(e => res.status(500).json(e))
      })
  }

  async handleEditProfileByToken({ body: { token } }: Request, res: Response) {
    (await editProfileByToken(token))
      .mapRight(userId => res.json(userId))
      .mapLeft(e => res.status(500).json(e))
  }

  async handleEditProfileByProvider(req: Request<any, any, EditProfileByProviderBody>, res: Response) {
    (await editProfileByProvider(req.body))
      .mapRight(user => res.json(user))
      .mapLeft(e => res.status(500).json(e))
  }

  async handleEditAvatar(req: Request, res: Response) {
    const { token, userId, avatarUrl } = req.body
    if (!checkToken(token, userId)) return res.status(498).json(new TokenError())
    const response = await editAvatar(userId, avatarUrl)
    response
      .mapRight(r => res.json(r))
      .mapLeft(e => res.status(500).json(e))
  }
}



