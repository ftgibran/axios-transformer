import {AxiosInstance, AxiosResponse} from 'axios'
import {
  ClassTransformOptions,
  plainToClass,
  plainToClassFromExist,
} from 'class-transformer'
import {axiosT} from './axiosT'
import {Request} from './Request'
import {ClassType, ResponseType} from './types'

export class RequestContext<T = any> {
  constructor(request: Request, responseType?: ResponseType<T>) {
    this.request = request
    this.responseType = responseType
  }

  readonly request: Request

  readonly responseType?: ResponseType<T>

  get axiosConfig() {
    return this.request.axiosConfig
  }

  get requestInstance() {
    return this.request.axiosInstance
  }

  get requestName() {
    return this.request.requestName
  }

  get requestDelay() {
    return this.request.requestDelay
  }

  get endpoint() {
    return this.request.endpoint
  }

  withInstance(requestName: AxiosInstance) {
    this.request.axiosInstance = requestName
    return this
  }

  withName(requestName: string) {
    this.request.requestName = requestName
    return this
  }

  withDelay(requestDelay: number) {
    this.request.requestDelay = Math.max(requestDelay, 0)
    return this
  }

  async fetchData(classTransformOptions?: ClassTransformOptions) {
    return (await this.fetchResponse(classTransformOptions)).data
  }

  async fetchResponse(
    classTransformOptions?: ClassTransformOptions
  ): Promise<AxiosResponse<T>> {
    const {axiosConfig, responseType, requestDelay} = this

    const {event} = axiosT

    event.emit('requestStart', this)

    let response: AxiosResponse<T> | null = null
    try {
      if (requestDelay) {
        await new Promise((resolve) => setTimeout(resolve, requestDelay))
      }

      response = await this.request.axiosInstance.request<T>(axiosConfig)
    } catch (e) {
      event.emit('requestError', this, e)
      throw e
    }

    event.emit('requestEnd', this, response)
    event.emit('transformStart', this, response)

    if (response.data === undefined) {
      response.data = JSON.parse(response.request.response || '{}')
    }

    if (responseType === undefined) {
      return response
    }

    if (typeof responseType === 'object') {
      // Class object instance from constructor (new CustomClass())
      // The instance will be automatically populated
      response.data = plainToClassFromExist(
        responseType as T,
        response.data,
        classTransformOptions
      )
    } else if (typeof responseType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      response.data = plainToClass(
        responseType as ClassType<T>,
        response.data,
        classTransformOptions
      )
    } else throw Error('Error: Entity should be either a Class or ClassObject')

    event.emit('transformEnd', this, response)

    return response
  }
}
