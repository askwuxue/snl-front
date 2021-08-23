import request from '@/utils/request'

// 获取所有角色
export const getAll = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 删除角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 保存或者更新角色
export const saveOrUpdate = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 获取角色
export const getRole = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}
