import request from '@/utils/request'

// ==================== 文章管理 ====================

/**
 * 获取文章列表（分页 + 筛选）
 * @param {Object} params - 查询参数
 * @param {String} params.type - 文章类型：news / faq
 * @param {Number} params.navigationId - 导航ID（可选）
 * @param {String} params.keyword - 搜索关键词（可选）
 * @param {Number} params.status - 状态筛选（可选）
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页条数
 */
export function getArticleList(params) {
  return request({
    url: '/tenant/article/list',
    method: 'get',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticleById(id) {
  return request({
    url: `/tenant/article/${id}`,
    method: 'get'
  })
}

/**
 * 创建文章
 */
export function createArticle(data) {
  return request({
    url: '/tenant/article',
    method: 'post',
    data
  })
}

/**
 * 更新文章
 */
export function updateArticle(id, data) {
  return request({
    url: `/tenant/article/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除文章
 */
export function deleteArticle(id) {
  return request({
    url: `/tenant/article/${id}`,
    method: 'delete'
  })
}

/**
 * 批量更新文章排序
 */
export function updateArticleSort(ids) {
  return request({
    url: '/tenant/article/sort',
    method: 'put',
    data: ids
  })
}

/**
 * 获取前端展示用的文章列表（已发布的）
 * @param {Object} params - 查询参数
 * @param {String} params.type - 文章类型：news / faq
 * @param {Number} params.navigationId - 导航ID（可选）
 * @param {String} params.keyword - 搜索关键词（可选）
 * @param {Number} params.page - 页码
 * @param {Number} params.pageSize - 每页条数
 */
export function getPublicArticleList(params) {
  return request({
    url: '/public/article/list',
    method: 'get',
    params
  })
}

/**
 * 获取前端展示用的文章详情（已发布的）
 */
export function getPublicArticleById(id) {
  return request({
    url: `/public/article/${id}`,
    method: 'get'
  })
}
