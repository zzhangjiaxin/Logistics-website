import request from '@/utils/request'

/**
 * 获取站点信息（需要租户认证）
 */
export function getSiteInfo() {
  return request({
    url: '/tenant/site-info',
    method: 'get'
  })
}

/**
 * 获取公开的站点信息（不需要租户认证）
 */
export function getPublicSiteInfo() {
  return request({
    url: '/public/site-info',
    method: 'get'
  })
}

/**
 * 保存或更新站点信息
 */
export function saveSiteInfo(data) {
  return request({
    url: '/tenant/site-info',
    method: 'post',
    data
  })
}
