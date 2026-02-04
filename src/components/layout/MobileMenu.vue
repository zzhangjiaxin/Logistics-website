<template>
  <div id="menu" :class="{ active: menuOpen }">
    <div class="close">
      <div class="lang">
        <a href="javascript:;">简体中文</a>&nbsp;&nbsp;/&nbsp;&nbsp;
        <a href="javascript:;">English</a>&nbsp;&nbsp;/&nbsp;&nbsp;
        <a href="javascript:;">Tiếng Việt</a>
      </div>
      <span @click="closeMenu">
        <i class="layui-icon layui-icon-close"></i>关闭
      </span>
    </div>
    <div class="list">
      <p><router-link to="/" @click="closeMenu">首页</router-link></p>
    </div>
    <div class="list">
      <p>
        <router-link to="/track" @click="closeMenu">信息查询</router-link>
        <span @click="toggleSubmenu(0)" :class="{ active: submenus[0] }">
          <i class="layui-icon layui-icon-down"></i>
        </span>
      </p>
      <dl v-show="submenus[0]">
        <dt><router-link to="/track" @click="closeMenu">运单查询</router-link></dt>
        <dt><router-link to="/track?type=parcel" @click="closeMenu">包裹查询</router-link></dt>
      </dl>
    </div>
    <div class="list">
      <p>
        <router-link to="/aboutus" @click="closeMenu">关于我们</router-link>
        <span @click="toggleSubmenu(1)" :class="{ active: submenus[1] }">
          <i class="layui-icon layui-icon-down"></i>
        </span>
      </p>
      <dl v-show="submenus[1]">
        <dt><router-link to="/aboutus#dw1" @click="closeMenu">公司简介</router-link></dt>
        <dt><router-link to="/aboutus#dw2" @click="closeMenu">企业理念</router-link></dt>
        <dt><router-link to="/aboutus#dw3" @click="closeMenu">发展历程</router-link></dt>
        <dt><router-link to="/aboutus#dw4" @click="closeMenu">荣誉资质</router-link></dt>
      </dl>
    </div>
    <div class="list">
      <p>
        <router-link to="/business" @click="closeMenu">主营渠道</router-link>
        <span @click="toggleSubmenu(2)" :class="{ active: submenus[2] }">
          <i class="layui-icon layui-icon-down"></i>
        </span>
      </p>
      <dl v-show="submenus[2]">
        <dt><router-link to="/business-1" @click="closeMenu">空派专线</router-link></dt>
        <dt><router-link to="/business-2" @click="closeMenu">海派专线</router-link></dt>
        <dt><router-link to="/business-3" @click="closeMenu">陆运专线</router-link></dt>
      </dl>
    </div>
    <div class="list">
      <p>
        <router-link to="/news" @click="closeMenu">新闻中心</router-link>
        <span @click="toggleSubmenu(3)" :class="{ active: submenus[3] }">
          <i class="layui-icon layui-icon-down"></i>
        </span>
      </p>
      <dl v-show="submenus[3]">
        <dt><router-link to="/news-1" @click="closeMenu">公司新闻</router-link></dt>
        <dt><router-link to="/news-2" @click="closeMenu">行业动态</router-link></dt>
      </dl>
    </div>
    <div class="list">
      <p><router-link to="/help" @click="closeMenu">帮助中心</router-link></p>
    </div>
    <div class="list">
      <p><router-link to="/contact" @click="closeMenu">联系我们</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMenuStore } from '@/stores'

const menuStore = useMenuStore()

// 使用 Pinia store 中的菜单状态
const menuOpen = computed(() => menuStore.isOpen)

// 子菜单展开状态（保留在组件内，因为是纯 UI 状态）
const submenus = ref([false, false, false, false])

const closeMenu = () => {
  if (menuStore.isOpen) {
    menuStore.closeMenu()
  }
}

const toggleSubmenu = (index) => {
  submenus.value[index] = !submenus.value[index]
}
</script>
