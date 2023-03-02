import { RootState, useAppSelector } from "../store/store"

export const useCollection = () => {
  const collectionState = useAppSelector((state: RootState) => state.collection)
  const { id: currentUserId, isAdmin } = useAppSelector((state: RootState) => state.user.currentUser)
  const isAuthor = currentUserId && (collectionState.collection.userId === currentUserId || isAdmin)
  const getTheme = (themeId: number = collectionState.collection.themeId) => {
    return collectionState.themes.find(theme => theme.id === themeId)
  }
  return { getTheme, isAuthor, ...collectionState }
}
