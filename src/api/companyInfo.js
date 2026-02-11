import request from '@/utils/request'

/**
 * 获取分支机构列表（管理员使用）
 */
export function getCompanyBranches() {
  return request({
    url: '/tenant/company-info/branches',
    method: 'get',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
}

/**
 * 保存分支机构列表（管理员使用 - 批量）
 * @param {Array} data - 分支机构列表
 */
export function saveCompanyBranches(data) {
  return request({
    url: '/tenant/company-info/branches',
    method: 'put',
    data
  })
}

/**
 * 新增单条分支机构
 * @param {Object} data - 分支机构数据
 */
export function addCompanyBranch(data) {
  return request({
    url: '/tenant/company-info/branch',
    method: 'post',
    data
  })
}

/**
 * 修改单条分支机构
 * @param {Number} id - 分支机构ID
 * @param {Object} data - 分支机构数据
 */
export function updateCompanyBranch(id, data) {
  return request({
    url: `/tenant/company-info/branch/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除单条分支机构
 * @param {Number} id - 分支机构ID
 */
export function deleteCompanyBranch(id) {
  return request({
    url: `/tenant/company-info/branch/${id}`,
    method: 'delete'
  })
}

/**
 * 获取分支机构列表（前端展示页面使用）
 */
export function getPublicCompanyBranches() {
  return request({
    url: '/public/company-info/branches',
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
