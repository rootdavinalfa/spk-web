import Vue from 'vue'
import App from './App.vue'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'
import VueRouter from 'vue-router'
const url = process.env.VUE_APP_DBURL ? process.env.VUE_APP_DBURL : 'http://127.0.0.1:2323/saw/'

Vue.prototype.$apiurl = url;
Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueRouter)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/style/default.css'

import home from '@/components/index/home'
import saw from '@/components/index/saw'

const router = new VueRouter({
  routes: [{
    path: '/',
    component: home,
    name: 'home',
    props: true
  },
  {
    path: '/saw',
    component: saw,
    name: 'saw',
    props: true
  },
 ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)

}).$mount('#app')