import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Element
import ElementUI from 'element-ui'

// 引入主题文件
import 'element-ui/lib/theme-chalk/index.css'

// 将ElementUI注册为Vue插件
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
