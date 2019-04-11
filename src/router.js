import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import { TokenService } from '@/services/storage.service'
const Main = () => import('@/views/Main.vue')
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
      redirect: { name: 'home' },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: '/ages',
          name: 'ages.index',
          component: () => import('@/views/Ages/IndexAgePage.vue')
        },
        {
          path: '/ages/show/:routeKey',
          props: true,
          name: 'ages.show',
          component: () => import('@/views/Ages/ShowAgePage.vue')
        },
        {
          path: '/ages/create',
          name: 'ages.create',
          component: () => import('@/views/Ages/CreateAgePage.vue')
        },
        {
          path: '/ages/edit/:routeKey',
          props: true,
          name: 'ages.edit',
          component: () => import('@/views/Ages/EditAgePage.vue')
        },
        {
          path: '/brands',
          name: 'brands.index',
          component: () => import('@/views/Brands/IndexBrandPage.vue')
        },
        {
          path: '/brands/show/:routeKey',
          props: true,
          name: 'brands.show',
          component: () => import('@/views/Brands/ShowBrandPage.vue')
        },
        {
          path: '/brands/create',
          name: 'brands.create',
          component: () => import('@/views/Brands/CreateBrandPage.vue')
        },
        {
          path: '/brands/edit/:routeKey',
          props: true,
          name: 'brands.edit',
          component: () => import('@/views/Brands/EditBrandPage.vue')
        },
        {
          path: '/categories',
          name: 'categories.index',
          component: () => import('@/views/Categories/IndexCategoryPage.vue')
        },
        {
          path: '/categories/show/:routeKey',
          props: true,
          name: 'categories.show',
          component: () => import('@/views/Categories/ShowCategoryPage.vue')
        },
        {
          path: '/categories/create',
          name: 'categories.create',
          component: () => import('@/views/Categories/CreateCategoryPage.vue')
        },
        {
          path: '/categories/edit/:routeKey',
          props: true,
          name: 'categories.edit',
          component: () => import('@/views/Categories/EditCategoryPage.vue')
        },
        {
          path: '/products',
          name: 'products.index',
          component: () => import('@/views/Products/IndexProductPage.vue')
        },
        {
          path: '/products/show/:routeKey',
          props: true,
          name: 'products.show',
          component: () => import('@/views/Products/ShowProductPage.vue')
        },
        {
          path: '/products/create',
          name: 'products.create',
          component: () => import('@/views/Products/CreateProductPage.vue')
        },
        {
          path: '/products/edit/:routeKey',
          props: true,
          name: 'products.edit',
          component: () => import('@/views/Products/EditProductPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // clear validation errors
  if (!store.getters['validation/isEmpty']) store.dispatch('validation/clearErrors')

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
