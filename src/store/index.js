import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.module'
import validation from './validation.module'
import status from './status.module'
import page from './page.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    validation,
    status,
    page
  }
})
