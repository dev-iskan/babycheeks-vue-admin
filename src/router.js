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
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: '/ages',
          name: 'ages-list',
          component: () => import('@/views/Ages/AgesTablePage.vue')
        },
        {
          path: '/ages/:routeKey',
          props: true,
          name: 'ages-single',
          component: () => import('@/views/Ages/SingleAgePage.vue')
        },
        {
          path: '/ages/create',
          name: 'ages-create',
          component: () => import('@/views/Ages/CreateAgePage.vue')
        },
        {
          path: '/brands',
          name: 'brands-list',
          component: () => import('@/views/Brands/BrandsTablePage.vue')
        },
        {
          path: '/brands/:routeKey',
          props: true,
          name: 'brands-single',
          component: () => import('@/views/Brands/SingleBrandPage.vue')
        },
        {
          path: '/brands/create',
          name: 'brands-create',
          component: () => import('@/views/Brands/CreateBrandPage.vue')
        },
        {
          path: '/categories',
          name: 'categories-list',
          component: () => import('@/views/Categories/CategoriesTablePage.vue')
        },
        {
          path: '/categories/:routeKey',
          props: true,
          name: 'categories-single',
          component: () => import('@/views/Categories/SingleCategoryPage.vue')
        },
        {
          path: '/categories/create',
          name: 'categories-create',
          component: () => import('@/views/Categories/CreateCategoryPage.vue')
        },
        {
          path: '/products',
          name: 'products-list',
          component: () => import('@/views/Products/ProductsTablePage.vue')
        },
        {
          path: '/products/:routeKey',
          props: true,
          name: 'products-single',
          component: () => import('@/views/Products/SingleProductPage.vue')
        },
        {
          path: '/products/create',
          name: 'products-create',
          component: () => import('@/views/Products/CreateProductPage.vue')
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
