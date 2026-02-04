import { ElMessage } from 'element-plus'

/**
 * 自定义消息提示 - 完全匹配源网页动画效果
 * 源网页实现（Wints函数）：
 * - 初始状态：top: 40% 位置，opacity: 1（直接显示，不淡入）
 * - 淡出：2秒后移动到 top: 20% 位置，opacity: 0
 * - 使用 marginTop 为元素高度的一半实现垂直居中
 */
const showCustomMessage = (message, duration = 2000) => {
  const messageInstance = ElMessage({
    message,
    type: 'warning',
    duration,
    showClose: false,
    customClass: 'custom-message',
    grouping: true,
    offset: 0
  })

  // 使用 setTimeout 确保 DOM 已经渲染
  setTimeout(() => {
    // 查找最新添加的消息元素
    const allMessages = document.querySelectorAll('.el-message.custom-message')
    const messageEl = allMessages[allMessages.length - 1]

    if (messageEl) {
      // 重置 transform，使用源网页的定位方式
      messageEl.style.transform = 'none'
      messageEl.style.left = '50%'
      messageEl.style.marginLeft = '-150px'

      // 等待元素完全渲染后获取高度
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 计算垂直居中需要的 margin-top（元素高度的一半）
          // 使用 outerHeight 确保包含 padding 和 border
          const elementHeight = messageEl.offsetHeight
          const marginTop = -Math.floor(elementHeight / 2)

          // 设置初始状态（40% 位置，完全显示）- 匹配源网页
          messageEl.style.top = '40%'
          messageEl.style.marginTop = `${marginTop}px`
          messageEl.style.opacity = '1'

          // 添加过渡效果（位置和透明度都变化）- 匹配源网页
          messageEl.style.transition = 'all 0.5s ease'

          // 淡出动画：移动到 20% 位置并淡出 - 匹配源网页
          setTimeout(() => {
            messageEl.style.top = '20%'
            messageEl.style.opacity = '0'
          }, duration)
        })
      })
    }
  }, 10)

  return messageInstance
}

/**
 * 显示警告消息提示（匹配源网页样式）
 * @param {string} message - 提示消息内容
 * @param {number} duration - 显示时长（毫秒），默认 2000ms
 */
export const showMessage = (message, duration = 2000) => {
  return showCustomMessage(message, duration)
}

/**
 * 显示成功消息
 * @param {string} message - 提示消息内容
 * @param {number} duration - 显示时长（毫秒），默认 2000ms
 */
export const showSuccess = (message, duration = 2000) => {
  return showCustomMessage(message, duration)
}

/**
 * 显示错误消息
 * @param {string} message - 提示消息内容
 * @param {number} duration - 显示时长（毫秒），默认 2000ms
 */
export const showError = (message, duration = 2000) => {
  return showCustomMessage(message, duration)
}

/**
 * 显示信息消息
 * @param {string} message - 提示消息内容
 * @param {number} duration - 显示时长（毫秒），默认 2000ms
 */
export const showInfo = (message, duration = 2000) => {
  return showCustomMessage(message, duration)
}
