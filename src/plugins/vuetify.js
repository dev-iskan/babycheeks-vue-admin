import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  options: {
    customProperties: true
  },
  iconfont: 'md',
  theme: {
    primary: '#766cd6',
    secondary: '#2933DD'
  }
})
