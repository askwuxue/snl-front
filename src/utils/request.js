import axios from 'axios'
import store from '@/store'
// 引入router
import router from '@/router'
import qs from 'querystring'
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
  // 判断user信息并统一设置token，对于后端接口来说，没有token也无所谓。依旧可以访问数据
  if (store.state.user && store.state.user.content) {
    config.headers.Authorization = JSON.parse(store.state.user.content).access_token
  } else {
    config.headers.Authorization = null
  }
  return config
})
// 如果存在多次请求，刷新token只需要一次即可
let isRefreshing = false
// 用户请求的数量不发生变化，只是刷新token的请求只有一次
const requests = []
// 设置响应拦截器
request.interceptors.response.use(response => {
  // 请求成功 状态码为2XX
  return response
}, error => {
  let errorMessage
  if (error.response) {
    // 请求失败，服务器返回状态码为2XX以外
    if (error.response.status === 400) {
      errorMessage = 'request params error'
    }
    // 刷新token
    if (error.response.status === 401) {
      // 本地不存在token
      if (!store.state.user) {
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.redirect
          }
        })
        return Promise.reject(error)
      }
      // 是否存在正在刷新token的请求
      if (isRefreshing) {
        // 将除第一个请求之外的其他请求暂时存储
        return requests.push(() => {
          request(error.config)
        })
      }
      // 存在token但token过期或者不正确
      // 发送请求刷新token
      if (store.state.user && store.state.user.content) {
        isRefreshing = true
        return request({
          method: 'POST',
          url: '/front/user/refresh_token',
          data: qs.stringify({
            refreshtoken: JSON.parse(store.state.user.content || null).refresh_token
          })
        })
          // token刷新成功
          .then(res => {
            // 更新token
            store.commit('setUser', res.data)
            // 第一个请求重新发送
            request(error.config)
            // 其他请求重新发送
            while (requests.length) {
              requests.pop()()
            }
          })
          // token刷新失败
          .catch(error => {
            console.log('error: ', error)
          })
          // 最终处理
          .finally(() => {
            isRefreshing = false
          })
          // 不会刷新token，返回登录
      } else {
        router.push({
          name: 'login',
          query: {
            redirect: router.currentRoute.redirect
          }
        })
        return Promise.reject(error)
      }
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
