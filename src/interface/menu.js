import request from '@/utils/request'

// 获取编辑菜单页面信息
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id: id
    }
  })
}

// 添加菜单
export const createMenuList = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}
