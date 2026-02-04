import request from '@/utils/request'

/**
 * 上传图片
 * @param {File} file - 图片文件
 * @param {String} type - 图片类型（参考模板目录结构）：
 *                        - logo: 站点LOGO（固定文件名，存储在 images/）
 *                        - footer-logo: 尾部LOGO（固定文件名，存储在 images/）
 *                        - uploadfile: 普通上传文件（时间戳命名 yyyyMMdd-HHmmss，存储在 uploadfiles/）
 *                        - thumb: 缩略图（时间戳命名 yyyyMMdd-HHmmss，存储在 thumbs/）
 *                        - tenant-image: 租户专用图片（时间戳命名 yyyyMMdd_HHmmss，存储在 uploadfiles_{域名前缀}/images/）
 */
export function uploadImage(file, type = 'uploadfile') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  return request({
    url: '/tenant/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
