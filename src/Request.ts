import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {classToPlain, ClassTransformOptions} from 'class-transformer'
import {RequestContext} from './RequestContext'
import {ResponseType} from './types'

export class Request {
  constructor(axiosConfig: AxiosRequestConfig) {
    this.axiosConfig = axiosConfig
  }

  readonly axiosConfig: AxiosRequestConfig

  axiosInstance: AxiosInstance = axios
  requestName?: string
  requestDelay?: number

  static get(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = {method: 'GET', url}
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static delete(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = {method: 'DELETE', url}
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static head(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = {method: 'HEAD', url}
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static options(url: string, axiosConfig?: AxiosRequestConfig) {
    const localConfig: AxiosRequestConfig = {method: 'OPTIONS', url}
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static post(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: classToPlain(data, classTransformOptions),
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static put(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'PUT',
      url,
      data: classToPlain(data, classTransformOptions),
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  static patch(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    const localConfig: AxiosRequestConfig = {
      method: 'PATCH',
      url,
      data: classToPlain(data, classTransformOptions),
    }
    return new Request(Object.assign(localConfig, axiosConfig))
  }

  get endpoint() {
    const url = this.axiosConfig.url || ''
    return url
      .replace(/^(?:https?:)?\/\/.*(?=\.)[^\/]*/g, '')
      .replace(/(?=\?).*/g, '')
  }

  withInstance(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
    return this
  }

  withName(requestName: string) {
    this.requestName = requestName
    return this
  }

  withDelay(requestDelay: number) {
    this.requestDelay = Math.max(requestDelay, 0)
    return this
  }

  addHeader(key: string, value: string) {
    if (!this.axiosConfig.headers) {
      this.axiosConfig.headers = {}
    }

    this.axiosConfig.headers[key] = value
    return this
  }

  removeHeader(key: string) {
    if (this.axiosConfig.headers) delete this.axiosConfig.headers[key]
    return this
  }

  addParams(key: string, value: string) {
    if (!this.axiosConfig.params) {
      this.axiosConfig.params = {}
    }

    this.axiosConfig.params[key] = value
    return this
  }

  removeParams(key: string) {
    if (this.axiosConfig.params) delete this.axiosConfig.params[key]
    return this
  }

  as<T = any>(responseType?: ResponseType<T>) {
    return new RequestContext<T>(this, responseType)
  }

  asArrayOf<T = any>(responseType?: ResponseType<T>) {
    return new RequestContext<T[]>(this, responseType as ResponseType<any>)
  }

  asAny() {
    return new RequestContext<any>(this)
  }

  asVoid() {
    return new RequestContext<void>(this)
  }

  asString() {
    return new RequestContext<string>(this)
  }

  asNumber() {
    return new RequestContext<number>(this)
  }

  asBoolean() {
    return new RequestContext<boolean>(this)
  }
}
