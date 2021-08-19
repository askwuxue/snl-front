import request from '@/utils/request'

// 按条件分页查询资源
export const getResourcePages = (data = {}) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
