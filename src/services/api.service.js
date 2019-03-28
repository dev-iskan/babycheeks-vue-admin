import axios from 'axios'
import { TokenService } from './storage.service'
import router from '@/router'
import store from '@/store'

const ApiService = {
  _interceptor: null,

  init (baseURL) {
    axios.defaults.baseURL = baseURL
    axios.defaults.headers.common['Accept'] = `application/json`
  },

  setHeader () {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TokenService.getToken()}`
  },

  removeHeader () {
    axios.defaults.headers.common['Authorization'] = ''
  },

  get (resource, params = {}) {
    return axios.get(resource, params)
  },

  post (resource, data) {
    return axios.post(resource, data)
  },

  put (resource, data) {
    return axios.put(resource, data)
  },

  delete (resource) {
    return axios.delete(resource)
  },

  /**
     * Perform a custom Axios request.
     *
     * data is an object containing the following properties:
     *  - method
     *  - url
     *  - data ... request payload
     *  - auth (optional)
     *    - username
     *    - password
    **/
  customRequest (data) {
    return axios(data)
  },

  mountInterceptor () {
    this._interceptor = axios.interceptors.response.use(response => response, async (error) => {
      if (error.request && error.request.status === 401) {
        // Refresh token has failed. Logout the user
        router.push({ name: 'logout' })
      }

      if (error.request && error.request.status === 422) {
        store.dispatch('validation/setErrors', error.response.data.errors)
      }

      // If error was not 401 just reject as is
      throw error
    })

    this._request = axios.interceptors.request.use(config => {
      // clear validation errors
      store.dispatch('validation/clearErrors')
      return config
    })
  },

  unmountInterceptor () {
    // Eject the interceptor
    axios.interceptors.response.eject(this._interceptor)
  }
}

export default ApiService
