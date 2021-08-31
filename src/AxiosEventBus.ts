import {AxiosResponse} from 'axios'
import {RequestContext} from './RequestContext'

export type AxiosEventType =
  | 'requestStart'
  | 'requestError'
  | 'requestEnd'
  | 'transformStart'
  | 'transformEnd'

export type AxiosBusMap = Record<string, AxiosBusCallback[] | undefined>

export type AxiosBusCallback<
  T1 extends AxiosEventType = AxiosEventType,
  T2 = any
> = T1 extends 'requestStart'
  ? (context: RequestContext<T2>) => void
  : T1 extends 'requestError'
  ? (context: RequestContext<T2>, e: any) => void
  : (context: RequestContext<T2>, response: AxiosResponse<T2>) => void

export class AxiosEventBus {
  private bus: AxiosBusMap

  constructor() {
    this.bus = {}
  }

  on<T extends AxiosEventType>(key: T, callback: AxiosBusCallback<T>) {
    this.bus[key] = [...(this.bus[key] ?? []), callback]
  }

  off<T extends AxiosEventType>(key: T, callback: AxiosBusCallback<T>) {
    this.bus[key] = this.bus[key]?.filter(
      (it: AxiosBusCallback) => it !== callback
    )
  }

  emit<T>(key: 'requestStart', context: RequestContext<T>): void
  emit<T>(key: 'requestError', context: RequestContext<T>, e: any): void
  emit<T>(
    key: AxiosEventType,
    context: RequestContext<T>,
    response: AxiosResponse<T>
  ): void
  emit(key: AxiosEventType, ...params: any[]) {
    for (const callback of this.bus[key] ?? []) {
      callback(params[0], params[1])
    }
  }

  clean() {
    this.bus = {}
  }
}
