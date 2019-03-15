import ApiService from './api.service'
import { TokenService } from './storage.service'

const UserService = {
  login: async (email, password) => {
    const requestData = {
      method: 'post',
      url: 'auth/login',
      data: {
        email: email,
        password: password
      }
    }

    try {
      const response = await ApiService.customRequest(requestData)

      TokenService.saveToken(response.data.meta.access_token)
      ApiService.setHeader()

      return response.data
    } catch (error) {
      throw error
    }
  },

  me: async () => {
    const requestData = {
      method: 'get',
      url: 'auth/me'
    }
    try {
      const response = await ApiService.customRequest(requestData)

      return response.data.data
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    TokenService.removeToken()
    ApiService.removeHeader()
  }
}

export default UserService

export { UserService }
