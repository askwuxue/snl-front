import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Element
// import ElementUI from 'element-ui'
import ElementUI from '@/common/element-config'

// 引入日期格式化函数
import formatDate from '@/common/formatDate'

// 引入公共样式
import '../src/styles/index.scss'

// 将ElementUI注册为Vue插件
Vue.use(ElementUI)

// 日期格式化过滤器
Vue.filter('formatDate', formatDate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
