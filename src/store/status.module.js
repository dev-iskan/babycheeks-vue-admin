const state = () => ({
  message: ''
})

const getters = {
  message: state => state.message
}

const mutations = {
  SET_MESSAGE: (state, message) => {
    state.message = message
  }
}

const actions = {
  setMessage: ({ commit }, message) => {
    commit('SET_MESSAGE', message)
  },

  clearMessage: ({ commit }) => {
    commit('SET_MESSAGE', '')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
