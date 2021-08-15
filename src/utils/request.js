import axios from 'axios'
import store from '@/store'
// 单独引用Message组件
import { Message } from 'element-ui'

const request = axios.create({
  // timeout: 100
})

// 获取baseURL
const getBaseURL = url => {
  if (url.startsWith('/front')) {
    return 'http://edufront.lagou.com'
  } else {
    return 'http://eduboss.lagou.com'
  }
}
// 设置请求拦截器
request.interceptors.request.use(config => {
  // 根据config参数的url属性值动态设置baseURL
  config.baseURL = getBaseURL(config.url)
  // 判断user信息并统一设置token
  if (store.state.user && store.state.user.content) {
    config.headers.Authorization = JSON.parse(store.state.user.content).access_token
  }
  return config
})

// 设置响应拦截器
request.interceptors.response.use(response => {
  // 请求成功 状态码为2XX
  // console.log('response: ', response)
  return response
}, error => {
  let errorMessage
  if (error.response) {
    // 请求失败，服务器返回状态码为2XX以外
    if (error.response.status === 400) {
      errorMessage = 'request params error'
    }
    if (error.response.status === 401) {
      errorMessage = 'Unauthorized'
    }
    if (error.response.status === 403) {
      errorMessage = 'Forbidden'
    }
    if (error.response.status === 404) {
      errorMessage = 'Not Found'
    }
    if (error.response.status >= 500) {
      errorMessage = 'serve error'
    }
  } else if (error.request) {
    // 请求失败，但是服务器没有返回例如请求超时
    errorMessage = '请求超时了'
  } else {
    // 请求时发生的意料之外的错误
    errorMessage = error.message
  }
  // 提示响应错误信息
  Message.error(errorMessage)
  // 抛出错误，响应拦截器不是对所有错误进行处理
  return Promise.reject(error)
})

export default request
