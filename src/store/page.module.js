const state = () => ({
  loading: false
})

const getters = {
  pageLoading: state => state.loading
}

const mutations = {
  SET_LOADING: (state, status) => {
    state.loading = status
  }
}

const actions = {
  setPageLoading: ({ commit }) => {
    commit('SET_LOADING', true)
  },

  setPageReady: ({ commit }) => {
    commit('SET_LOADING', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
