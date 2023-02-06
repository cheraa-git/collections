import { storage } from './firebaseConfig'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"


export const saveImageToCloud = async (file: File) => {
  // TODO: отработать исключения
  const storageRef = ref(storage, `files/${file.name}`)
  const uploadTask = await uploadBytes(storageRef, file)
  return await getDownloadURL(uploadTask.ref)
}
