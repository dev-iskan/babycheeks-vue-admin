import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import ApiService from './services/api.service'
import TokenService from './services/storage.service'
import './assets/styles.scss'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import validationMixin from './mixins/validation'
import pageMixin from './mixins/page'
import Editor from '@tinymce/tinymce-vue'
import vue2Dropzone from 'vue2-dropzone'
import './assets/vue2Dropzone.min.css'
import CardTitle from '@/components/CardTitle'

Vue.component('VueDropzone', vue2Dropzone)
Vue.component('Editor', Editor)
Vue.component('CardTitle', CardTitle)
Vue.config.productionTip = false
Vue.mixin(validationMixin)
Vue.mixin(pageMixin)

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_PROD_ROOT_API)
ApiService.mountInterceptor()
// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader()
  store.dispatch('auth/fetchUser')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
