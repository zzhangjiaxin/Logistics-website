<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>联系我们</h2>
        <p>翔宇达，使命必达</p>
      </div>
    </div>

    <!-- 移动端标题 -->
    <div id="bname-m">
      <h2>联系我们</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <strong>联系我们</strong>
    </div>

    <!-- 联系信息 -->
    <div id="contact">
      <div class="wrap">
        <div class="tits">
          <h2>公司联系信息</h2>
        </div>

        <!-- 中国总部 -->
        <div class="conts">
          <div class="tis">中国总部</div>
          <div class="rows">
            <div class="text">
              <h3 class="name">深圳会展湾</h3>
              <div class="editorc">
                <p>总部地址：深圳市宝安区福海街道展城社区展景路83号会展湾中港广场6座B栋1005室</p>
                <p>福永仓库地址：深圳市宝安区福海街道和秀西路68号宝祥和工业园深腾耀商务大厦一楼103-107</p>
                <p>电话：400-836-9156</p>
              </div>
            </div>
            <!-- 地图暂时隐藏 -->
            <!-- <div class="map">
              <iframe
                src="bdmap.php?point=113.785239,22.709053&name=%E6%B7%B1%E5%9C%B3%E4%BC%9A%E5%B1%95%E6%B9%BE"
                width="100%"
                height="100%"
                allowtransparency="true"
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div> -->
          </div>
        </div>

        <!-- 越南总部 -->
        <div class="conts">
          <div class="tis">越南总部</div>
          <div class="rows">
            <div class="text">
              <div class="editorc">
                <p>地址：河内市北慈廉区宣道外交使团区BT5 - 22</p>
                <p>电话：0853555688</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 中国分公司 -->
        <div class="conts">
          <div class="tis">中国分公司</div>

          <div class="rows">
            <div class="text">
              <h3 class="name">深圳坂田</h3>
              <div class="editorc">
                <p>地址：深圳市龙岗区坂田街道上雪科技园8D栋101</p>
                <p>电话：15220102532</p>
              </div>
            </div>
            <!-- 地图暂时隐藏 -->
            <!-- <div class="map">
              <iframe
                src="bdmap.php?point=114.089716,22.642608&name=%E6%B7%B1%E5%9C%B3%E5%9D%82%E7%94%B0"
                width="100%"
                height="100%"
                allowtransparency="true"
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div> -->
          </div>

          <div class="rows">
            <div class="text">
              <h3 class="name">义乌市</h3>
              <div class="editorc">
                <p>地址：浙江省金华市义乌市义乌市春晗二区115栋1楼整层</p>
                <p>电话：18194030089</p>
              </div>
            </div>
            <!-- 地图暂时隐藏 -->
            <!-- <div class="map">
              <iframe
                src="bdmap.php?point=120.075679,29.306296&name=%E4%B9%89%E4%B9%8C%E5%B8%82"
                width="100%"
                height="100%"
                allowtransparency="true"
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div> -->
          </div>

          <div class="rows">
            <div class="text">
              <h3 class="name">广州市</h3>
              <div class="editorc">
                <p>地址：广州市白云区嘉禾街道望岗西岭路181号B栋1、2楼</p>
                <p>电话：17702052235</p>
              </div>
            </div>
            <!-- 地图暂时隐藏 -->
            <!-- <div class="map">
              <iframe
                src="bdmap.php?point=113.276904,23.243642&name=%E5%B9%BF%E5%B7%9E%E5%B8%82"
                width="100%"
                height="100%"
                allowtransparency="true"
                frameborder="0"
                scrolling="no"
              ></iframe>
            </div> -->
          </div>
        </div>

        <!-- 微信公众号 -->
        <div class="conts">
          <div class="tis">微信公众号</div>
          <div class="qrcode">
            <img src="@/assets/uploadfiles/20230704-152915.jpg" alt="微信公众号">
          </div>
        </div>
      </div>
    </div>

    <!-- 服务链接 -->
    <div id="fyw">
      <div class="wrap">
        <router-link to="/business-1">
          <h2>空派专线</h2>
          <p>专注于美国、英国和墨西哥</p>
          <img src="@/assets/images/fyw11.png" alt="">
        </router-link>
        <router-link to="/business-2">
          <h2>海派专线</h2>
          <p>专注于美国、英国、欧洲和墨西哥</p>
          <img src="@/assets/images/fyw22.png" alt="">
        </router-link>
        <router-link to="/business-3">
          <h2>陆运专线</h2>
          <p>专注于英国、欧洲和越南</p>
          <img src="@/assets/images/fyw33.png" alt="">
        </router-link>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'

useScrollPosition()

import bannerBg from '@/assets/uploadfiles/20230706-142647.jpg'
</script>
