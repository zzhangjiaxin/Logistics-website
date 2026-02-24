import request from '@/utils/request'

export function getTenantLogs(params) {
  return request({
    url: '/tenant/logs',
    method: 'get',
    params
  })
}

export function getRecentTenantLogs(limit = 10) {
  return request({
    url: '/tenant/logs/recent',
    method: 'get',
    params: { limit }
  })
}
