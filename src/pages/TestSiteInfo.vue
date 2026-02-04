<template>
  <div style="padding: 50px; max-width: 800px; margin: 0 auto; background: #f5f5f5;">
    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #333; border-bottom: 3px solid #409eff; padding-bottom: 10px;">
        🧪 站点信息API测试组件
      </h1>

      <div style="margin: 20px 0;">
        <button @click="testAPI" style="background: #409eff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
          🔄 测试API
        </button>
        <button @click="clearData" style="background: #f56c6c; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
          🗑️ 清除数据
        </button>
      </div>

      <!-- API状态 -->
      <div v-if="loading" style="padding: 15px; background: #e6f7ff; border-left: 4px solid #1890ff; margin: 20px 0;">
        ⏳ 正在请求API...
      </div>

      <div v-if="error" style="padding: 15px; background: #fff2f0; border-left: 4px solid #ff4d4f; margin: 20px 0; color: #ff4d4f;">
        <strong>❌ 错误：</strong> {{ error }}
      </div>

      <div v-if="success" style="padding: 15px; background: #f6ffed; border-left: 4px solid #52c41a; margin: 20px 0; color: #52c41a;">
        <strong>✅ 成功：</strong> API调用成功！
      </div>

      <!-- 站点信息显示 -->
      <div v-if="siteInfo" style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 5px;">
        <h2 style="color: #333; margin-top: 0;">📊 站点信息</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; color: #666;">租户ID：</td>
            <td style="padding: 10px;">{{ siteInfo.tenantId }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #fafafa;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点标题：</td>
            <td style="padding: 10px; color: #409eff; font-weight: bold;">{{ siteInfo.siteTitle }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点副标题：</td>
            <td style="padding: 10px;">{{ siteInfo.siteSubtitle }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #fafafa;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点域名：</td>
            <td style="padding: 10px;">{{ siteInfo.siteDomain }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点LOGO：</td>
            <td style="padding: 10px;">{{ siteInfo.siteLogo }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #fafafa;">
            <td style="padding: 10px; font-weight: bold; color: #666;">尾部LOGO：</td>
            <td style="padding: 10px;">{{ siteInfo.footerLogo }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点备案号：</td>
            <td style="padding: 10px; color: #52c41a; font-weight: bold;">{{ siteInfo.siteIcp }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #fafafa;">
            <td style="padding: 10px; font-weight: bold; color: #666;">站点模板：</td>
            <td style="padding: 10px;">{{ siteInfo.siteTemplate }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; font-weight: bold; color: #666;">尾部信息：</td>
            <td style="padding: 10px;">{{ siteInfo.footerInfo }}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd; background: #fafafa;">
            <td style="padding: 10px; font-weight: bold; color: #666;">更新时间：</td>
            <td style="padding: 10px;">{{ siteInfo.updatedAt }}</td>
          </tr>
        </table>
      </div>

      <!-- 页脚预览 -->
      <div v-if="siteInfo" style="margin: 20px 0;">
        <h2 style="color: #333;">👁️ 页脚预览效果</h2>
        <div style="padding: 20px; background: #333; color: white; text-align: center; border-radius: 4px;" v-html="footerPreview"></div>
      </div>

      <!-- 原始JSON -->
      <div v-if="rawJson" style="margin: 20px 0;">
        <h2 style="color: #333;">📄 原始JSON数据</h2>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px;">{{ rawJson }}</pre>
      </div>

      <!-- 调试信息 -->
      <div style="margin: 20px 0; padding: 15px; background: #fff7e6; border-left: 4px solid #faad14;">
        <h3 style="margin-top: 0; color: #333;">🔧 调试信息</h3>
        <p><strong>API地址：</strong> {{ apiUrl }}</p>
        <p><strong>请求时间：</strong> {{ requestTime }}</p>
        <p><strong>响应时间：</strong> {{ responseTime }}</p>
        <p><strong>耗时：</strong> {{ duration }}ms</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getPublicSiteInfo } from '@/api/siteInfo'

const loading = ref(false)
const error = ref('')
const success = ref(false)
const siteInfo = ref(null)
const rawJson = ref('')
const apiUrl = ref('http://localhost:8080/api/public/site-info')
const requestTime = ref('')
const responseTime = ref('')
const duration = ref(0)

// 计算页脚预览
const footerPreview = computed(() => {
  if (!siteInfo.value) return ''

  let html = siteInfo.value.footerInfo || 'Copyright © 2023 XYD Global Express Service. All rights reserved.'

  // 如果有备案号，自动添加备案链接
  if (siteInfo.value.siteIcp) {
    html += ` <a href="https://beian.miit.gov.cn/" target="_blank" style="color: #66b1ff;">${siteInfo.value.siteIcp}</a>`
  }

  return html
})

// 测试API
const testAPI = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  siteInfo.value = null
  rawJson.value = ''

  const startTime = Date.now()
  requestTime.value = new Date().toLocaleString()

  try {
    console.log('🚀 开始调用 getPublicSiteInfo()...')

    const res = await getPublicSiteInfo()

    const endTime = Date.now()
    responseTime.value = new Date().toLocaleString()
    duration.value = endTime - startTime

    console.log('✅ API响应成功:', res)
    console.log('📦 返回数据:', res.data)

    if (res.data) {
      siteInfo.value = res.data
      rawJson.value = JSON.stringify(res, null, 2)
      success.value = true

      console.log('🎯 站点标题:', res.data.siteTitle)
      console.log('🎯 备案号:', res.data.siteIcp)
      console.log('🎯 尾部信息:', res.data.footerInfo)
    } else {
      error.value = 'API返回数据为空'
      console.error('❌ API返回数据为空')
    }
  } catch (err) {
    const endTime = Date.now()
    responseTime.value = new Date().toLocaleString()
    duration.value = endTime - startTime

    error.value = err.message || '请求失败'
    console.error('❌ API调用失败:', err)
    console.error('❌ 错误详情:', {
      message: err.message,
      stack: err.stack,
      response: err.response
    })
  } finally {
    loading.value = false
  }
}

// 清除数据
const clearData = () => {
  siteInfo.value = null
  rawJson.value = ''
  error.value = ''
  success.value = false
  requestTime.value = ''
  responseTime.value = ''
  duration.value = 0
  console.log('🗑️ 数据已清除')
}

// 页面加载时自动测试
testAPI()
</script>
