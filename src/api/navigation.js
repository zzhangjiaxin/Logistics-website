import request from '@/utils/request'

/**
 * 获取导航列表
 */
export function getNavigationList() {
  return request({
    url: '/tenant/navigation/list',
    method: 'get'
  })
}

/**
 * 获取启用的导航列表（前端展示用）
 */
export function getEnabledNavigationList() {
  return request({
    url: '/tenant/navigation/enabled',
    method: 'get'
  })
}

/**
 * 根据ID获取导航详情
 */
export function getNavigationById(id) {
  return request({
    url: `/tenant/navigation/${id}`,
    method: 'get'
  })
}

/**
 * 创建导航
 */
export function createNavigation(data) {
  return request({
    url: '/tenant/navigation',
    method: 'post',
    data
  })
}

/**
 * 更新导航
 */
export function updateNavigation(id, data) {
  return request({
    url: `/tenant/navigation/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除导航
 */
export function deleteNavigation(id) {
  return request({
    url: `/tenant/navigation/${id}`,
    method: 'delete'
  })
}

/**
 * 批量更新排序
 */
export function updateNavigationSort(ids) {
  return request({
    url: '/tenant/navigation/sort',
    method: 'put',
    data: ids
  })
}

/**
 * 获取树形结构的导航列表
 */
export function getNavigationTree() {
  return request({
    url: '/tenant/navigation/tree',
    method: 'get'
  })
}

/**
 * 获取启用的树形结构导航列表（前端展示用）
 */
export function getEnabledNavigationTree() {
  return request({
    url: '/tenant/navigation/enabled/tree',
    method: 'get'
  })
}

/**
 * 获取顶级导航列表（用于父级选择器）
 */
export function getTopLevelNavigation() {
  return request({
    url: '/tenant/navigation/top-level',
    method: 'get'
  })
}
