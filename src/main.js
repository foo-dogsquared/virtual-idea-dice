import Vue from 'vue'
import router from './router'
import App from './App.vue'
import './registerServiceWorker'
import VueRouter from 'vue-router'
import VueModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueModal)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
