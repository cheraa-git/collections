import { RootState, useAppSelector } from "../store/store"

export const useCollection = () => {
  const { collection, themes, items, itemConfigs } = useAppSelector((state: RootState) => state.collection)

  const getThemeName = (themeId: number = collection.themeId) => {
    return themes.find(theme => theme.id === themeId)?.name
  }
  return { getThemeName, collection, themes, items, itemConfigs }
}
