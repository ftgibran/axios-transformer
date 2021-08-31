import {Exclude, Expose, Type} from 'class-transformer'
import {ClassType} from './types'

export function AxiosTransform<T>(clsType: ClassType<T>) {
  return Type(() => clsType)
}

export function AxiosRequestExpose(name?: string) {
  return Expose({name, toPlainOnly: true})
}

export function AxiosResponseExpose(name?: string) {
  return Expose({name, toClassOnly: true})
}

export function AxiosExpose(name?: string) {
  return Expose({name})
}

export function AxiosGroupsInclude(groups: string[], name?: string) {
  return Expose({name, groups})
}

export function AxiosRequestExclude() {
  return Exclude({toPlainOnly: true})
}

export function AxiosResponseExclude() {
  return Exclude({toClassOnly: true})
}

export function AxiosExclude() {
  return Exclude()
}
