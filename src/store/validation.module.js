const state = () => ({
  errors: {}
})

const getters = {
  errors: state => state.errors
}

const mutations = {
  SET_VALIDATIONS_ERRORS: (state, errors) => {
    state.errors = errors
  }
}

const actions = {
  setErrors: ({ commit }, errors) => {
    commit('SET_VALIDATIONS_ERRORS', errors)
  },

  clearErrors: ({ commit }) => {
    commit('SET_VALIDATIONS_ERRORS', {})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
