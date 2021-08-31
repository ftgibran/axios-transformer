import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {Request} from './Request'
import {ClassTransformOptions} from 'class-transformer'

export class AxiosTransformer {
  instance: AxiosInstance

  constructor(axiosInstance?: AxiosInstance) {
    this.instance = axiosInstance ?? axios
  }

  get defaults() {
    return this.instance.defaults
  }

  get interceptors() {
    return this.instance.interceptors
  }

  getUri(axiosConfig: AxiosRequestConfig) {
    return this.instance.getUri(axiosConfig)
  }

  request(axiosConfig: AxiosRequestConfig): Request
  request(url: string, axiosConfig: AxiosRequestConfig): Request
  request(
    arg1: string | AxiosRequestConfig,
    arg2?: AxiosRequestConfig
  ): Request {
    if (typeof arg1 === 'string') {
      const localConfig: AxiosRequestConfig = {url: arg1}
      return new Request(Object.assign(localConfig, arg2 ?? {})).withInstance(
        this.instance
      )
    }

    return new Request(arg1 ?? {}).withInstance(this.instance)
  }

  get(url: string, axiosConfig?: AxiosRequestConfig) {
    return Request.get(url, axiosConfig).withInstance(this.instance)
  }

  delete(url: string, axiosConfig?: AxiosRequestConfig) {
    return Request.delete(url, axiosConfig).withInstance(this.instance)
  }

  head(url: string, axiosConfig?: AxiosRequestConfig) {
    return Request.head(url, axiosConfig).withInstance(this.instance)
  }

  options(url: string, axiosConfig?: AxiosRequestConfig) {
    return Request.options(url, axiosConfig).withInstance(this.instance)
  }

  post(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    return Request.post(
      url,
      data,
      axiosConfig,
      classTransformOptions
    ).withInstance(this.instance)
  }

  put(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    return Request.put(
      url,
      data,
      axiosConfig,
      classTransformOptions
    ).withInstance(this.instance)
  }

  patch(
    url: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
    classTransformOptions?: ClassTransformOptions
  ) {
    return Request.patch(
      url,
      data,
      axiosConfig,
      classTransformOptions
    ).withInstance(this.instance)
  }
}
