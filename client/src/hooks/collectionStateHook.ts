import { RootState, useAppSelector } from "../store/store"

export const useCollection = () => {
  const collectionState = useAppSelector((state: RootState) => state.collection)

  const getThemeName = (themeId: number = collectionState.collection.themeId) => {
    return collectionState.themes.find(theme => theme.id === themeId)?.name
  }
  return { getThemeName, ...collectionState }
}
