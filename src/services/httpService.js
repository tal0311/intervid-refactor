import axios from 'axios'
import axiosRetry from 'axios-retry'
import store from '../store'
import router from '@/router'
import { loggerService } from './loggerService'
import { tokenService } from './tokenService'
import { getErr } from './errorService'
import config from '@/config'

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 2000
  },
  retryCondition: (error) => {
    if (!error.response) return true
    return error.response.status === 503
  },
})

var HTTP = axios.create({
  withCredentials: true,
  baseURL: config.apiUrl,
})

HTTP.interceptors.request.use(
  (config) => {
    const path = window.location.pathname
    const isInterview = path.includes('interview') && !path.includes('dashboard')
    config.headers.Authorization = `Bearer ${tokenService.getToken(isInterview ? 'cand_' : '')}`

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

export default {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  },
  customRequest(method, endpoint, data, options) {
    return ajax(endpoint, method, data, options)
  },
  mount401Interceptor() {
    this._401interceptor = HTTP.interceptors.response.use(
      (response) => {
        return response
      },
      async (err) => {
        if (err.__CANCEL__) return
        if (err.response && err.response.status !== 401) throw err
        if (err.config?.url?.includes('auth/token')) {
          store.dispatch('auth/logout')
          throw err
        }
        try {
          await store.dispatch('auth/refreshToken')
          // const res = await this.customRequest(err.config.method, err.config.url, err.config.data)
          // return { data: res }
          throw err
        } catch (e) {
          throw err
        }
      },
    )
  },
  unmount401Interceptor() {
    HTTP.interceptors.response.eject(this._401interceptor)
  },
}
// async (err) => {
//   if (err.response && err.response.status !== 401) throw err
//   if (err.config.url.includes('auth/token')) {
//     store.dispatch('auth/logout')
//     throw err
//   }
//   try {
//     // console.log('jksjs');
//     await store.dispatch('auth/refreshToken')
//     // console.log('succeed');
//     // const res = await this.customRequest(err.config.method, err.config.url, err.config.data)
//     // return { data: res }
//   } catch (e) {
//     // console.log('eror');
//     // throw err
//   } finally {
//     // throw err
//     // router.push('/login')
//   }
// },
async function ajax(endpoint, method = 'get', data = null, options = {}) {
  try {
    const res = await HTTP({
      url: endpoint,
      method,
      data,
      ...options,
    })
    return res && res.data
  } catch (e) {
    if (e.response && !e.config?.url?.includes('record')) loggerService.error('Error in http request', e)
    const err = getErr(e)
    if (err.statusCode === 403) {
      store.commit('app/setAlertData', {
        alertData: { type: 'fail', txt: 'You dont have enough permissions to complete this action' },
      })
      router.go(-1)
    }
    throw err
  }
}
