import { initializeApp } from "firebase/app"
import { getStorage } from 'firebase/storage'
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC-hGXdjWeQ6LmQyhKpZf1VX97IS4lCZR0",
  authDomain: "collections-c4986.firebaseapp.com",
  projectId: "collections-c4986",
  storageBucket: "collections-c4986.appspot.com",
  messagingSenderId: "221505618253",
  appId: "1:221505618253:web:9ff0bf8363a2ecc9c73704",
  measurementId: "G-CJ133JYWVW"
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
export type ProviderType = GithubAuthProvider | GoogleAuthProvider | FacebookAuthProvider
