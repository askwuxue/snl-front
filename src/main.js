import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Element
import ElementUI from 'element-ui'

// 引入主题文件
// import 'element-ui/lib/theme-chalk/index.css'

// 引入公共样式
import '../src/styles/index.scss'

// 将ElementUI注册为Vue插件
Vue.use(ElementUI)

// 日期格式化过滤器
Vue.filter('formatDate', function (value) {
  if (!value) {
    return 'xxxx-xx-xx xx:xx:xx'
  }
  const date = new Date(value)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDay()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
