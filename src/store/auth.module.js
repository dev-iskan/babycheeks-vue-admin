import { UserService } from '../services/user.service'
import { TokenService } from '../services/storage.service'

const state = {
  accessToken: TokenService.getToken(),
  user: {}
}

const getters = {
  loggedIn: (state) => !!state.accessToken,

  user: state => state.user
}

const actions = {
  login: async ({ commit }, { email, password }) => {
    try {
      const data = await UserService.login(email, password)
      commit('loginSuccess', data.meta.access_token)
      commit('setUser', data.data)
      return true
    } catch (error) {
      throw error
    }
  },

  logout: async ({ commit }) => {
    try {
      UserService.logout()
      commit('logoutSuccess')

      return true
    } catch (error) {
      throw error
    }
  },

  fetchUser: async ({ commit }) => {
    try {
      const user = await UserService.me()
      commit('setUser', user)

      return true
    } catch (error) {
      throw error
    }
  }
}

const mutations = {
  loginSuccess: (state, accessToken) => {
    state.accessToken = accessToken
  },

  setUser: (state, user) => {
    state.user = user
  },

  logoutSuccess: state => {
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
