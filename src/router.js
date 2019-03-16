import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { TokenService } from '@/services/storage.service'
const Main = () => import('@/views/Main.vue')
const Home = () => import('@/views/Home.vue')
const LogIn = () => import('@/views/Auth/LogIn.vue')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: LogIn,
      name: 'login',
      meta: {
        public: true, // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter (to, from, next) {
        store.dispatch('auth/logout').then(() =>
          next({
            name: 'login'
          })
        )
      }
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

router.beforeEach((to, from, next) => {
  // clear validation errors
  store.dispatch('validation/clearErrors')

  // check if auth
  const isPublic = to.matched.some(record => record.meta.public)
  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
  const loggedIn = !!TokenService.getToken()

  if (!isPublic && !loggedIn) {
    return next({
      name: 'login',
      query: { redirectTo: to.fullPath } // Store the full path to redirect the user to after login
    })
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next({
      name: 'home'
    })
  }

  next()
})

export default router
