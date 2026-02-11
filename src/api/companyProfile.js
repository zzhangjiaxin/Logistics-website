import request from '@/utils/request'

/**
 * 获取企业简介配置（管理员使用）
 */
export function getCompanyProfile() {
  return request({
    url: '/tenant/company-profile',
    method: 'get',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
}

/**
 * 保存企业简介配置（管理员使用）
 * @param {Object} data - 包含 companyIntro, historyItems[], honorItems[]
 */
export function saveCompanyProfile(data) {
  return request({
    url: '/tenant/company-profile',
    method: 'put',
    data
  })
}

/**
 * 获取企业简介配置（前端展示页面使用）
 */
export function getPublicCompanyProfile() {
  return request({
    url: '/public/company-profile',
    method: 'get',
    params: {
      _t: new Date().getTime()
    },
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
