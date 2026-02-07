/**
 * 跨标签页数据同步工具
 *
 * 原理：后台管理页面保存数据后，写入 localStorage 标记。
 * 展示页标签页通过 storage 事件监听到变化后，自动刷新对应数据。
 *
 * 使用方式：
 * - 后台保存成功后调用：notifyDataChange('site-info')
 * - 展示页监听：onDataChange(callback)
 */

const STORAGE_KEY = 'admin_data_updated'

/**
 * 通知其他标签页数据已更新
 * @param {string} type - 更新类型：site-info | navigation | carousel | home-about
 */
export function notifyDataChange(type) {
  const payload = JSON.stringify({
    type,
    timestamp: Date.now()
  })
  localStorage.setItem(STORAGE_KEY, payload)
}

/**
 * 监听其他标签页的数据变更事件
 * @param {function} callback - 回调函数，参数为 { type, timestamp }
 * @returns {function} 取消监听的函数
 */
export function onDataChange(callback) {
  const handler = (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const payload = JSON.parse(event.newValue)
        callback(payload)
      } catch (e) {
        // ignore
      }
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
