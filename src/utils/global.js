// 字符串判空
export function emptyStr(str) {
  if (str === '' || str === null || str === undefined) return true
  str = str.replace(/^\s+/g, '')
  str = str.replace(/\s+$/g, '')
  str = str.replace(/&nbsp;/g, '')
  return str === ''
}

// 字符串长度(中文算2)
export function strlen(str) {
  let realLength = 0
  const len = str.length
  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
  }
  return realLength
}

// 滚动到指定元素
export function scrollTo(selector, offset = 0, speed = 400) {
  const element = document.querySelector(selector)
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({
      top,
      behavior: speed > 0 ? 'smooth' : 'auto'
    })
  }
}

// 滚动到顶部
export function scrollTop(speed = 400) {
  window.scrollTo({
    top: 0,
    behavior: speed > 0 ? 'smooth' : 'auto'
  })
}

// 图片宽度自适应
export function picWidth() {
  const editors = document.querySelectorAll('.editorc, .editorc2')
  editors.forEach(editor => {
    const imgs = editor.querySelectorAll('img')
    imgs.forEach(img => {
      if (img.width > editor.offsetWidth) {
        img.style.width = '100%'
        img.style.height = 'auto'
      }
    })
  })
}
