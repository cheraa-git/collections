import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Either, left, right } from "@sweet-monads/either"

type EitherResponse<Err, T> = Either<AxiosError<Err>, AxiosResponse<T>>

interface AxiosGet {
  <Err = any, T = any>(url: string, config?: AxiosRequestConfig): Promise<EitherResponse<Err, T>>
}

interface AxiosPost {
  <Err = any, T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<EitherResponse<Err, T>>
}

interface AxiosDelete {
  <Err = any, T = any>(url: string, config?: AxiosRequestConfig): Promise<EitherResponse<Err, T>>
}

interface AxiosPatch {
  <Err = any, T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<EitherResponse<Err, T>>
}

const axiosApp = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
})

export const axiosGet: AxiosGet = async (url, config) => {
  try {
    return right(await axiosApp.get(url, config))
  } catch (e) {
    return left(e as AxiosError<any>)
  }
}


export const axiosPost: AxiosPost = async (url, data, config) => {
  try {
    return right(await axiosApp.post(url, data, config))
  } catch (e) {
    return left(e as AxiosError<any>)
  }
}


export const axiosDelete: AxiosDelete = async (url, config) => {
  try {
    return right(await axiosApp.delete(url, config))
  } catch (e) {
    return left(e as AxiosError<any>)
  }
}

export const axiosPatch: AxiosPatch = async (url, data, config) => {
  try {
    return right(await axiosApp.patch(url, data, config))
  } catch (e) {
    return left(e as AxiosError<any>)
  }
}

export default axiosApp
