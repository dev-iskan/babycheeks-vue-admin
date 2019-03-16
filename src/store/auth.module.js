import { UserService } from '../services/user.service'
import { TokenService } from '../services/storage.service'

const state = () => ({
  accessToken: TokenService.getToken(),
  user: {}
})

const getters = {
  loggedIn: (state) => !!state.accessToken,

  user: state => state.user
}

const actions = {
  login: async ({ commit }, { email, password }) => {
    try {
      const data = await UserService.login(email, password)
      commit('LOGIN_SUCCESS', data.meta.access_token)
      commit('SET_USER', data.data)
      return true
    } catch (error) {
      throw error
    }
  },

  logout: async ({ commit }) => {
    try {
      UserService.logout()
      commit('LOGOUT_SUCCESS')

      return true
    } catch (error) {
      throw error
    }
  },

  fetchUser: async ({ commit }) => {
    try {
      const user = await UserService.me()
      commit('SET_USER', user)

      return true
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  LOGIN_SUCCESS: (state, accessToken) => {
    state.accessToken = accessToken
  },

  SET_USER: (state, user) => {
    state.user = user
  },

  LOGOUT_SUCCESS: state => {
    state.accessToken = ''
    state.user = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
