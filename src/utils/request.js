import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // timeout: 2000
})

// 获取baseURL
const getBaseURL = url => {
  if (url.startsWith('/front')) {
    return 'http://edufront.lagou.com'
  } else {
    return 'http://eduboss.lagou.com'
  }
}
// 设置拦截器
request.interceptors.request.use(config => {
  // 根据config参数的url属性值动态设置baseURL
  config.baseURL = getBaseURL(config.url)
  // 判断user信息并统一设置token
  if (store.state.user && store.state.user.content) {
    config.headers.Authorization = JSON.parse(store.state.user.content).access_token
  }
  return config
})

export default request
