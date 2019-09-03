// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import Element from 'element-ui'

import axios from 'axios'
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

Vue.use(Element)
Vue.use(VueRouter)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 这里判断用户是否登录，我例子中是验证本地存储是否有token
    if (!localStorage.token) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

// // 设置全局的请求次数，请求的间隙
// axios.defaults.retry = 4
// axios.defaults.retryDelay = 2000

// axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
//   var config = err.config
//   // If config does not exist or the retry option is not set, reject
//   if (!config || !config.retry) return Promise.reject(err)

//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0

//   // Check if we've maxed out the total number of retries
//   if (config.__retryCount >= config.retry) {
//     // Reject with the error
//     return Promise.reject(err)
//   }

//   // Increase the retry count
//   config.__retryCount += 1

//   // Create new promise to handle exponential backoff
//   var backoff = new Promise(function (resolve) {
//     setTimeout(function () {
//       resolve()
//     }, config.retryDelay || 1)
//   })

//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function () {
//     return axios(config)
//   })
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
