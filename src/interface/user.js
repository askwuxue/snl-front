import request from '@/utils/request'
import qs from 'qs'
import store from '@/store'

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
    url: '/front/user/getInfo',
    headers: {
      Authorization: JSON.parse(store.state.user.content).access_token
    }
  })
}
