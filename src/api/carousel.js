import request from '@/utils/request'

/**
 * 获取轮播图列表
 */
export function getCarouselList() {
  return request({
    url: '/tenant/carousel/list',
    method: 'get'
  })
}

/**
 * 获取启用的轮播图列表（前端展示用）
 */
export function getEnabledCarouselList() {
  return request({
    url: '/tenant/carousel/enabled',
    method: 'get'
  })
}

/**
 * 根据ID获取轮播图详情
 */
export function getCarouselById(id) {
  return request({
    url: `/tenant/carousel/${id}`,
    method: 'get'
  })
}

/**
 * 创建轮播图
 */
export function createCarousel(data) {
  return request({
    url: '/tenant/carousel',
    method: 'post',
    data
  })
}

/**
 * 更新轮播图
 */
export function updateCarousel(id, data) {
  return request({
    url: `/tenant/carousel/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除轮播图
 */
export function deleteCarousel(id) {
  return request({
    url: `/tenant/carousel/${id}`,
    method: 'delete'
  })
}

/**
 * 根据分组获取启用的轮播图列表（前端展示用）
 */
export function getEnabledCarouselByGroup(groupName) {
  return request({
    url: `/tenant/carousel/group/${groupName}/enabled`,
    method: 'get'
  })
}

/**
 * 批量更新排序
 */
export function updateCarouselSort(ids) {
  return request({
    url: '/tenant/carousel/sort',
    method: 'put',
    data: ids
  })
}

/**
 * 批量禁用指定分组下的所有轮播图
 */
export function disableCarouselsByGroup(groupName) {
  return request({
    url: `/tenant/carousel/group/${groupName}/disable`,
    method: 'put'
  })
}
