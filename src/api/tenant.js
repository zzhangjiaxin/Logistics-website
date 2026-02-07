import request from '@/utils/request'

/**
 * 获取当前租户信息
 */
export function getTenantInfo() {
  return request({
    url: '/tenant/info',
    method: 'get'
  })
}
