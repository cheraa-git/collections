import { storage } from './firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"


export const saveImageToCloud = async (file: File | undefined) => {
  if (!file) return ''
  try {
    const storageRef = ref(storage, `files/${file.name}`)
    const uploadTask = await uploadBytes(storageRef, file)
    return await getDownloadURL(uploadTask.ref)
  } catch (e) {
    console.log(e)
    return ''
  }
}
