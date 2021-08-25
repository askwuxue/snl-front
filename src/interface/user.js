import request from '@/utils/request'
import qs from 'qs'
// import store from '@/store'

// 用户登录接口功能
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // 对数据进行application/x-www-form-urlencoded处理，qs.stringify对数据进行处理外，默认添加content-type
    data: qs.stringify(data)
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息
export const getUserPages = data => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户
export const forbidUser = id => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    id
  })
}
