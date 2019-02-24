import Vue from 'vue'
import router from './router'
import App from './App.vue'
import './registerServiceWorker'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
