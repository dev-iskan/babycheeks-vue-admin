import Vue from 'vue'
import Router from 'vue-router'

const Main = () => import('@/views/Main.vue')
const Home = () => import('@/views/Home.vue')
const SignIn = () => import('@/views/Auth/SignIn.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/signin',
      component: SignIn,
      name: 'signin'
    },
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        }
      ]
    }
  ]
})
