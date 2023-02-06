import { AppDispatch, RootState } from "../store"
import axios from "../../axios-app"
import { apiRoutes } from "../../constants/routes"
import { CreateCollectionData } from "../../types/collections"
import { saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { CreateCollectionBody } from "../../../../common/request-types"
import { setCollectionData } from "../slices/collectionSlice"


export const createCollection = ({ image, theme, title, itemConfigs, description }: CreateCollectionData) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { id: userId, token } = getState().user.currentUser
    let imageUrl = ''
    if (image) imageUrl = await saveImageToCloud(image)
    const sendData: CreateCollectionBody = { userId, token, imageUrl, theme, title, description, itemConfigs }
    const collection = (await axios.post(apiRoutes.COLLECTION.CREATE, sendData)).data
    console.log(collection)
  }

export const getCollection = (id: string) => async (dispatch: AppDispatch) => {
  const { collection, itemConfigs } = (await axios.get(`collection/${id}`)).data
  console.log(collection)
  dispatch(setCollectionData({ collection, itemConfigs }))
}


