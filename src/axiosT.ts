import {AxiosTransformer} from './AxiosTransformer'
import axios, {AxiosRequestConfig} from 'axios'
import {AxiosInstanceT, AxiosStaticT} from './types'
import {AxiosEventBus} from './AxiosEventBus'

const utils: any = require('axios/lib/utils.js')

export const axiosT: AxiosStaticT = utils.extend(new AxiosTransformer(), {
  event: new AxiosEventBus(),
  create: (axiosConfig: AxiosRequestConfig) => {
    const axiosInstance = axios.create(axiosConfig)
    return new AxiosTransformer(axiosInstance) as AxiosInstanceT
  },
  Cancel: axios.Cancel,
  CancelToken: axios.CancelToken,
  isCancel: axios.isCancel,
  all: axios.all,
  spread: axios.spread,
  isAxiosError: axios.isAxiosError,
})

axiosT.instance.options()