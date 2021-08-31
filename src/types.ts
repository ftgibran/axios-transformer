import {ClassConstructor as ClassType} from 'class-transformer'
import {
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  CancelStatic,
  CancelTokenStatic,
} from 'axios'
import {Request} from './Request'
import {AxiosEventBus} from './AxiosEventBus'

export {ClassConstructor as ClassType} from 'class-transformer'

export type ResponseType<T> = ClassType<T> | T

export interface AxiosInstanceT {
  instance: AxiosInstance
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  getUri(config?: AxiosRequestConfig): string
  request(config: AxiosRequestConfig): Request
  get(url: string, config?: AxiosRequestConfig): Request
  delete(url: string, config?: AxiosRequestConfig): Request
  head(url: string, config?: AxiosRequestConfig): Request
  options(url: string, config?: AxiosRequestConfig): Request
  post(url: string, data?: any, config?: AxiosRequestConfig): Request
  put(url: string, data?: any, config?: AxiosRequestConfig): Request
  patch(url: string, data?: any, config?: AxiosRequestConfig): Request
}

export interface AxiosStaticT extends AxiosInstanceT {
  event: AxiosEventBus
  create(config?: AxiosRequestConfig): AxiosInstanceT
  Cancel: CancelStatic
  CancelToken: CancelTokenStatic
  isCancel(value: any): boolean
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
  isAxiosError(payload: any): payload is AxiosError
}
