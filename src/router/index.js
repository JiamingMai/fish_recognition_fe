import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Table from '@/components/Table'
import Show from '@/components/Show'
import Account from '@/components/Account'
import Log from '@/components/Log'
import UpdatePassword from '@/components/UpdatePassword'
import Upload from '@/components/Upload'
import SmallPhoto from '@/components/SmallPhoto'

// const isDev = process.env.NODE_ENV !== 'production'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: isDev ? '' : '/btf/',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/page',
      //name: 'Home',
      component: Home,
      meta: {
        requireAuth: true
      },
      children: [{
        path: '/',
        name: 'Table',
        component: Table,
        meta: {
          requireAuth: true
        }
      }, {
        path: '/page/show',
        name: 'Show',
        component: Show,
        meta: {
          requireAuth: true
        }
      }, {
        path: '/page/log',
        name: 'Log',
        component: Log,
        meta: {
          requireAuth: true
        }
      }, {
        path: '/page/account',
        name: 'Account',
        component: Account,
        meta: {
          requireAuth: true
        }
      }]
    }, {
      path: '/updatePassword',
      name: 'UpdatePassword',
      component: UpdatePassword,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: {
        requireAuth: true
      }
    }, {
      path: '/SmallPhoto',
      name: 'SmallPhoto',
      component: SmallPhoto,
      meta: {
        requireAuth: true
      }
    }
  ]
})
