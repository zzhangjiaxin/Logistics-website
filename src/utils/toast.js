// 自定义提示框工具函数，模仿源网页的 Wints 函数
let toastTimer1 = null
let toastTimer2 = null

export function showToast(message) {
  // 清除之前的定时器
  if (toastTimer1) clearTimeout(toastTimer1)
  if (toastTimer2) clearTimeout(toastTimer2)

  // 移除已存在的提示框
  const existingToast = document.getElementById('win_ts')
  if (existingToast) {
    existingToast.remove()
  }

  // 创建提示框元素
  const toast = document.createElement('div')
  toast.id = 'win_ts'
  toast.innerHTML = message
  document.body.appendChild(toast)

  // 设置初始样式（与源网页完全一致）
  toast.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    z-index: 9999;
    margin-left: -170px;
    padding: 32px 20px;
    width: 300px;
    color: #fff;
    font-size: 22px;
    line-height: 1.4;
    text-align: center;
    opacity: 0;
    transition: all 0.5s;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    overflow: hidden;
  `

  // 立即显示（从 top: 20% 移动到 40%，并设置 opacity: 1）
  setTimeout(() => {
    toast.style.top = '40%'
    toast.style.opacity = '1'
  }, 10)

  // 2秒后开始淡出并上移
  toastTimer1 = setTimeout(() => {
    toast.style.top = '20%'
    toast.style.opacity = '0'
  }, 2000)

  // 2.5秒后移除元素
  toastTimer2 = setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove()
    }
  }, 2500)
}
