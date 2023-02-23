import { RootState, useAppSelector } from "../store/store"

export const useItem = () => {
  return useAppSelector((state: RootState) => state.item)
}
