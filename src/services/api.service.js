import axios from 'axios'
import { TokenService } from './storage.service'
import router from '@/router'

const ApiService = {
  _401interceptor: null,

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

  get (resource) {
    return axios.get(resource)
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
  mount401Interceptor () {
    this._401interceptor = axios.interceptors.response.use(response => response, async (error) => {
      if (error.request.status === 401) {
        // Refresh token has failed. Logout the user
        router.push({ name: 'logout' })
      }

      // If error was not 401 just reject as is
      throw error
    }
    )
  },

  unmount401Interceptor () {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor)
  }
}

export default ApiService
