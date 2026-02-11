import request from '@/utils/request'

/**
 * 获取仪表盘统计数据
 */
export function getDashboardStats() {
  return request({
    url: '/tenant/dashboard/stats',
    method: 'get'
  })
}
