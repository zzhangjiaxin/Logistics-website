<template>
  <div class="login-page">
    <!-- 光晕 -->
    <div class="bg-layer">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M4 9l12 7 12-7" stroke="currentColor" stroke-width="1.5"/>
            <path d="M16 16v14" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 12.5l6 3.5 6-3.5" stroke="currentColor" stroke-width="1" opacity="0.4"/>
          </svg>
        </div>
        <span class="brand-name">Logistics CMS</span>
      </div>

      <h2>后台管理系统</h2>
      <p class="subtitle">Sign in to your workspace</p>

      <el-form ref="formRef" :model="form" :rules="rules" @keyup.enter="handleLogin" hide-required-asterisk>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large" :prefix-icon="UserIcon" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password :prefix-icon="LockIcon" />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" class="login-btn" @click="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>验证中...</span>
        </el-button>
      </el-form>

      <div class="card-footer">
        <div class="divider-line"></div>
        <span>SECURE LOGIN</span>
        <div class="divider-line"></div>
      </div>
    </div>

    <!-- 全屏粒子层（最顶层，穿透一切） -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import request from '@/utils/request'

const UserIcon = shallowRef(User)
const LockIcon = shallowRef(Lock)

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const canvasRef = ref(null)

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await request({ url: '/auth/tenant/login', method: 'post', data: { username: form.username, password: form.password } })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('adminName', res.data.name)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/admin')
  } catch (e) { /* interceptor */ } finally { loading.value = false }
}

// ===== 3D 粒子动画（全部在最顶层，穿透卡片） =====
let animId = null
onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h, particles

  function resize() {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  }

  function initParticles() {
    const count = Math.floor((w * h) / 10000)
    particles = Array.from({ length: count }, () => {
      const layer = Math.random()
      let r, speed, o, blur
      if (layer < 0.35) {
        // 远景层：小、暗、慢
        r = Math.random() * 1 + 0.5; speed = 0.15; o = Math.random() * 0.25 + 0.1; blur = 0
      } else if (layer < 0.7) {
        // 中景层
        r = Math.random() * 2 + 1.5; speed = 0.4; o = Math.random() * 0.35 + 0.3; blur = 0
      } else if (layer < 0.9) {
        // 近景层：大、亮、快
        r = Math.random() * 3 + 2.5; speed = 0.6; o = Math.random() * 0.4 + 0.45; blur = 0
      } else {
        // 最前景：很大、带模糊、飘在最前面
        r = Math.random() * 5 + 4; speed = 0.9; o = Math.random() * 0.3 + 0.2; blur = Math.random() * 3 + 1.5
      }
      return {
        x: Math.random() * w, y: Math.random() * h, r, o, blur,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        pulse: Math.random() * Math.PI * 2
      }
    })
  }

  function draw() {
    ctx.clearRect(0, 0, w, h)

    // 连线
    const maxDist = 22500
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].blur > 0) continue // 最前景粒子不参与连线
      for (let j = i + 1; j < particles.length; j++) {
        if (particles[j].blur > 0) continue
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = dx * dx + dy * dy
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.3
          ctx.beginPath()
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`
          ctx.lineWidth = 0.8
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // 粒子
    for (const p of particles) {
      p.x += p.dx
      p.y += p.dy
      if (p.x < -50) p.x = w + 50
      if (p.x > w + 50) p.x = -50
      if (p.y < -50) p.y = h + 50
      if (p.y > h + 50) p.y = -50

      p.pulse += 0.015
      const pulseO = p.o + Math.sin(p.pulse) * 0.12

      if (p.blur > 0) {
        ctx.save()
        ctx.filter = `blur(${p.blur}px)`
      }

      // 外发光
      const glowR = p.blur > 0 ? p.r * 6 : p.r * 4
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
      grd.addColorStop(0, `rgba(56,189,248,${pulseO * 0.6})`)
      grd.addColorStop(1, 'rgba(56,189,248,0)')
      ctx.beginPath()
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      // 实心
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(56,189,248,${pulseO})`
      ctx.fill()

      if (p.blur > 0) ctx.restore()
    }

    animId = requestAnimationFrame(draw)
  }

  resize()
  initParticles()
  draw()
  window.addEventListener('resize', () => { resize(); initParticles() })
})

onUnmounted(() => { if (animId) cancelAnimationFrame(animId) })
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #060a13;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: rgba(56, 189, 248, 0.07);
  top: -200px;
  right: -150px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: rgba(99, 102, 241, 0.05);
  bottom: -150px;
  left: -120px;
}

/* ===== 卡片 ===== */
.login-card {
  position: relative;
  z-index: 5;
  width: 400px;
  padding: 48px 40px 36px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(16px);
  box-shadow:
    0 0 40px rgba(56, 189, 248, 0.06),
    0 25px 50px rgba(0, 0, 0, 0.4);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  color: #38bdf8;
}

.brand-icon svg { width: 100%; height: 100%; }

.brand-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: #f0f0f0;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.25);
  margin: 0 0 36px 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 4px;
}

.login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.login-btn:active { transform: translateY(0); }

.card-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 36px;
}

.card-footer span {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.12);
  letter-spacing: 3px;
  white-space: nowrap;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

/* ===== Element Plus 暗色覆盖 ===== */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  padding: 4px 14px;
  transition: box-shadow 0.2s;
}
:deep(.el-input__wrapper:hover) { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15) inset; }
:deep(.el-input__wrapper.is-focus) { box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5) inset; }
:deep(.el-input__inner) { color: #e0e0e0; }
:deep(.el-input__inner::placeholder) { color: rgba(255, 255, 255, 0.2); }
:deep(.el-input__prefix .el-icon) { color: rgba(255, 255, 255, 0.25); }
:deep(.el-form-item) { margin-bottom: 20px; }
:deep(.el-form-item__error) { padding-top: 4px; color: #f87171; }
:deep(.el-input__suffix .el-icon) { color: rgba(255, 255, 255, 0.25); }

@media (max-width: 480px) {
  .login-card { width: calc(100% - 32px); padding: 36px 28px 28px; }
}
</style>
