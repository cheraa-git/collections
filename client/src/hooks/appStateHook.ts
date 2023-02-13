import { RootState, useAppSelector } from "../store/store"

export const useApp = () => {
  return useAppSelector((state: RootState) => state.app)
}
