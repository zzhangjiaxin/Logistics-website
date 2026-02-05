import request from '@/utils/request'

/**
 * 获取首页关于我们配置（管理员使用）
 */
export function getHomeAboutInfo() {
  return request({
    url: '/tenant/home-about',
    method: 'get',
    // 禁用缓存，确保获取最新数据
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
}

/**
 * 保存首页关于我们配置（管理员使用）
 * @param {Object} data - 包含 description, mainImage, cards[], bottomImages[]
 */
export function saveHomeAboutInfo(data) {
  return request({
    url: '/tenant/home-about',
    method: 'put',
    data
  })
}

/**
 * 获取首页关于我们配置（前端展示页面使用）
 * 每次请求都会获取最新数据，不使用缓存
 */
export function getPublicHomeAboutInfo() {
  return request({
    url: '/public/home-about',
    method: 'get',
    // 添加时间戳参数，防止浏览器缓存
    params: {
      _t: new Date().getTime()
    },
    // 禁用缓存
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}
