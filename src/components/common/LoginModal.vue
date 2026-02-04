<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="login-modal-overlay" @click.self="handleClose">
        <div class="login-modal">
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="handleClose">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>

          <!-- 标题 -->
          <h2 class="modal-title">会员登录</h2>

          <!-- 登录表单 -->
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <input
                v-model="formData.userNo"
                type="text"
                class="form-input"
                placeholder="请输入手机号/账号"
                maxlength="50"
                required
              />
            </div>

            <div class="form-group">
              <input
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="请输入密码"
                maxlength="50"
                required
              />
            </div>

            <button type="submit" class="login-btn">登录</button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)

const formData = reactive({
  userNo: '',
  password: ''
})

const show = () => {
  visible.value = true
  // 重置表单
  formData.userNo = ''
  formData.password = ''
}

const handleClose = () => {
  visible.value = false
}

const handleLogin = () => {
  // 验证表单
  if (!formData.userNo.trim()) {
    alert('请输入手机号/账号')
    return
  }
  if (!formData.password.trim()) {
    alert('请输入密码')
    return
  }

  // 构建登录URL，携带账号密码参数
  const loginUrl = `https://kld.intelink.net.cn/oms/#/login?userNo=${encodeURIComponent(formData.userNo)}&password=${encodeURIComponent(formData.password)}&source=OTHER`

  // 在新窗口打开OMS系统
  window.open(loginUrl, '_blank')

  // 关闭弹窗
  handleClose()
}

defineExpose({
  show,
  handleClose
})
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.login-modal {
  position: relative;
  width: 450px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 50px 40px 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.8);
  color: #fff;
  transform: rotate(90deg);
}

.modal-title {
  color: #fff;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  font-size: 15px;
  color: #333;
  background: #fff;
  border: none;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus {
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
}

.login-btn {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #2980b9 0%, #21618c 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .login-modal,
.modal-leave-active .login-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .login-modal {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to .login-modal {
  transform: scale(0.9) translateY(-20px);
}

/* 响应式设计 */
@media only screen and (max-width: 480px) {
  .login-modal {
    width: 90%;
    max-width: 350px;
    padding: 40px 25px 30px;
  }

  .modal-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .form-input,
  .login-btn {
    height: 45px;
    font-size: 14px;
  }

  .close-btn {
    width: 35px;
    height: 35px;
    top: 10px;
    right: 10px;
  }
}
</style>
