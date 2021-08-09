import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口功能
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // 对数据进行application/x-www-form-urlencoded处理，qs.stringify对数据进行处理外，默认添加content-type
    data: qs.stringify(data)
  })
}
