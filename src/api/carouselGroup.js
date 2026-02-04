import request from '@/utils/request'

/**
 * 获取分组列表
 */
export function getCarouselGroupList() {
  return request({
    url: '/tenant/carousel-group/list',
    method: 'get'
  })
}

/**
 * 获取启用的分组列表
 */
export function getEnabledCarouselGroupList() {
  return request({
    url: '/tenant/carousel-group/enabled',
    method: 'get'
  })
}

/**
 * 根据ID获取分组详情
 */
export function getCarouselGroupById(id) {
  return request({
    url: `/tenant/carousel-group/${id}`,
    method: 'get'
  })
}

/**
 * 创建分组
 */
export function createCarouselGroup(data) {
  return request({
    url: '/tenant/carousel-group',
    method: 'post',
    data
  })
}

/**
 * 更新分组
 */
export function updateCarouselGroup(id, data) {
  return request({
    url: `/tenant/carousel-group/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除分组
 */
export function deleteCarouselGroup(id) {
  return request({
    url: `/tenant/carousel-group/${id}`,
    method: 'delete'
  })
}
