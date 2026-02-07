<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>{{ mainTitle }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>

    <!-- 移动端标题 -->
    <div id="bname-m">
      <h2>常见问题</h2>
    </div>

    <!-- 面包屑导航 - 移动端 -->
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/help">帮助中心</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/faq">常见问题</router-link>
    </div>

    <!-- 面包屑导航 - PC端 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/help">帮助中心</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/faq">常见问题</router-link>
      </div>
    </div>

    <!-- 文章内容 -->
    <div id="content" class="wrap">
      <div id="news_info">
        <h1>{{ articleData.title }}</h1>
        <p>
          <span><i class="layui-icon layui-icon-time"></i>{{ articleData.date }}</span>
        </p>
      </div>
      <div class="editorc_box">
        <div class="editorc editorc_tbe" v-html="articleData.content"></div>
      </div>

      <!-- 上一篇/下一篇 -->
      <div id="prevnext">
        <p v-if="articleData.prev" class="gots">
          上一篇：<router-link :to="articleData.prev.link">{{ articleData.prev.title }}</router-link>
        </p>
        <p v-else class="gots">上一篇：没有了</p>

        <p v-if="articleData.next" class="gots">
          下一篇：<router-link :to="articleData.next.link">{{ articleData.next.title }}</router-link>
        </p>
        <p v-else class="gots">下一篇：没有了</p>

        <router-link to="/help" id="prevnext_back">
          <i class="layui-icon layui-icon-left"></i>返回列表
        </router-link>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useScrollPosition } from '@/composables/useScrollPosition'
import { useBannerData } from '@/composables/useBannerData'

const route = useRoute()

// 使用滚动位置管理
useScrollPosition()

import defaultBannerBg from '@/assets/uploadfiles/20230706-142647.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('help-article', {
  bannerBg: defaultBannerBg,
  mainTitle: '帮助中心',
  subTitle: '始于客户需求，终于客户满意'
})

// 导入图片
import img_20230805_181622 from '@/assets/uploadfiles_xyd/images/20230805_181622.jpg'
import img_20230805_180129 from '@/assets/uploadfiles_xyd/images/20230805_180129.jpg'
import img_20230805_180211 from '@/assets/uploadfiles_xyd/images/20230805_180211.jpg'
import img_20230805_180414 from '@/assets/uploadfiles_xyd/images/20230805_180414.jpg'
import img_20230805_180439 from '@/assets/uploadfiles_xyd/images/20230805_180439.jpg'
import img_20230805_180455 from '@/assets/uploadfiles_xyd/images/20230805_180455.jpg'
import img_20230805_180509 from '@/assets/uploadfiles_xyd/images/20230805_180509.jpg'
import img_20230805_180520 from '@/assets/uploadfiles_xyd/images/20230805_180520.jpg'
import img_20230805_180531 from '@/assets/uploadfiles_xyd/images/20230805_180531.jpg'
import img_20230805_173248 from '@/assets/uploadfiles_xyd/images/20230805_173248.png'
import img_20230805_173313 from '@/assets/uploadfiles_xyd/images/20230805_173313.png'
import img_20230805_173356 from '@/assets/uploadfiles_xyd/images/20230805_173356.png'
import img_20230805_173433 from '@/assets/uploadfiles_xyd/images/20230805_173433.png'
import img_20230805_173459 from '@/assets/uploadfiles_xyd/images/20230805_173459.png'
import img_20230805_173515 from '@/assets/uploadfiles_xyd/images/20230805_173515.png'
import img_20230805_173552 from '@/assets/uploadfiles_xyd/images/20230805_173552.png'
import img_20230805_173608 from '@/assets/uploadfiles_xyd/images/20230805_173608.png'
import img_20230805_173627 from '@/assets/uploadfiles_xyd/images/20230805_173627.png'
import img_20230805_173648 from '@/assets/uploadfiles_xyd/images/20230805_173648.png'
import img_20230805_173702 from '@/assets/uploadfiles_xyd/images/20230805_173702.png'
import img_20230805_173725 from '@/assets/uploadfiles_xyd/images/20230805_173725.png'
import img_20230805_173752 from '@/assets/uploadfiles_xyd/images/20230805_173752.png'
import img_ups from '@/assets/uploadfiles_xyd/images/c670b1fd-8d6a-4857-8ef3-9c55e9eb39a8.png'

// 硬编码的文章数据库
const articleDatabase = {
  '3': {
    title: '一般贸易进出口流程图',
    date: '2023-07-16',
    content: `<p><img alt="" src="${img_20230805_181622}"></p>`,
    prev: { title: '国际物流中的角色', link: '/arts_ds4' },
    next: null
  },
  '4': {
    title: '国际物流中的角色',
    date: '2023-07-16',
    content: `<p><img alt="" src="${img_20230805_180129}"></p>

<p><img alt="" src="${img_20230805_180211}"></p>

<p><img alt="" src="${img_20230805_180414}"></p>

<p><img alt="" src="${img_20230805_180439}"><img alt="" src="${img_20230805_180455}"><img alt="" src="${img_20230805_180509}"><img alt="" src="${img_20230805_180520}"><img alt="" src="${img_20230805_180531}"></p>`,
    prev: { title: '物流的定义', link: '/arts_ds5' },
    next: { title: '一般贸易进出口流程图', link: '/arts_ds3' }
  },
  '5': {
    title: '物流的定义',
    date: '2023-07-16',
    content: `<div>中国的物流术语标准将物流定义为：物流是物品从供应地向接收地的实体流动过程中，根据实际需要，将运输、储存、装卸搬运、包装、流通加工、配送、信息处理等功能有机结合起来实现用户要求的过程。</div>`,
    prev: { title: '国际快递公司是怎样测量货物尺寸的?', link: '/arts_ds6' },
    next: { title: '国际物流中的角色', link: '/arts_ds4' }
  },
  '6': {
    title: '国际快递公司是怎样测量货物尺寸的?',
    date: '2023-07-16',
    content: `<p><img alt="" src="${img_20230805_173248}"></p>

<p>想必大家都经常会遇到客户这样的问题,<br>
为什么货物到了你们仓库尺寸会变大？<br>
为什么货物的箱子会多1-2cm,<br>
明明我的货物都是新箱子，<br>
....<br>
在回答这个问题之前，<br>
先看下国际快递公司是怎么测量货物的尺寸？<br>
这里以DHL公司为例<strong>.</strong></p>

<p><img alt="" src="${img_20230805_173313}"></p>

<p>作为交易流程的重要环节，<br>
为包裹称重计费必不可少，<br>
DHL操作指南里也有专门的介绍.</p>

<p><img alt="" src="${img_20230805_173356}"></p>

<p align="justify">什么是体积重量?<br>
体积重量是运输行业内的<br>
一种计算轻泡货物重量的方法。<br>
体积重量是将货物体积，<br>
利用折算公式，就可以获得的货物重量。<br>
体积重量计算公式=长cm×宽cm×高cm/5000<br>
<strong>国际货运是按商品的重量和体积重量进行计费的，</strong></p>

<p align="justify"><strong>当包裹的体积重量大于实际重量才会按照体积重量计费。</strong><br>
不同快递公司总的计费重计算方式有些不同，<br>
以UPS最特殊。</p>

<p>操作中遇到的规整不规整货物：</p>

<p><img alt="" src="${img_20230805_173433}"></p>

<p><img alt="" src="${img_20230805_173459}"></p>

<p><img alt="" src="${img_20230805_173515}"></p>

<p><img alt="" src="${img_20230805_173552}"></p>

<p><img alt="" src="${img_20230805_173608}"></p>

<p><strong>实际操作中体积重有3种量度方式：</strong></p>

<p>①标准包裹量度方式：<br>
包裹为标准纸箱尺寸，<br>
则按纸箱长宽高计算体积重。</p>

<p><img alt="" src="${img_20230805_173627}"></p>

<p>例：如DHL渠道，包裹长15，宽30，高20，<br>
则体积重=（15×30×20）/5000=1.8KG，<br>
而实际重量为1.2KG，<br>
则此包裹按体积重1.8KG计算运费,<br>
最终计费重2KG。</p>

<p> </p>

<p>②曲面包裹量度方式：</p>

<p>如包裹因货物挤压导致箱子平面膨胀变形凸起，</p>

<p>则按包裹最长边计算。</p>

<p><img alt="" src="${img_20230805_173648}"></p>

<p>例：如DHL渠道，纸箱实际长15，宽30，高20；</p>

<p>因货物挤压，封箱后长18，宽33，高22，</p>

<p>则体积重=（18×33×22）/5000=2.7KG，<br>
而实际重量为2KG，<br>
则此包裹按体积重2.7KG计算运费，</p>

<p>最终计费重3KG。</p>

<p>③不规则包裹量度方式：</p>

<p>因货物实际大小需要打包成不规则包裹，</p>

<p>则包裹按最长边计算体积重。</p>

<p><img alt="" src="${img_20230805_173702}"></p>

<p>例：如DHL渠道，<br>
不规则包裹最长长度为15，最长宽40，最长高25</p>

<p>则体积重=（15×40×25）/5000=3KG，<br>
而实际重量为2KG，<br>
则此包裹按体积重3KG计算运费。</p>

<p align="justify"><br>
DHL实际操作<br>
仔细<strong>中间的激光测量</strong>：</p>

<p align="justify"><img alt="" src="${img_20230805_173752}"></p>

<p><img alt="" src="${img_20230805_173725}"></p>

<p align="justify"><strong>包裹检测时是采用3D镜头+算法的解决方案，</strong><br>
<strong>自动取最鼓处的边长而得出的体积重。</strong><br>
<strong>能够实现毫米级的识别精度。</strong><br>
<strong>测量机器使用工业机器人领域的</strong><br>
<strong>V-SLAM算法对镜头实时定位，</strong><br>
<strong>提高产品对环境的稳定性，</strong><br>
<strong>能在仓库等干扰环境下使用；</strong><br>
<strong>结合条码识别技术与称重传感器，</strong><br>
<strong>可以快速识别出条码并与体积重量数据关联。</strong><br>
<strong>能够将货物的体积信息精确到0.5mm的误差，</strong><br>
<strong>精度高,同时实现静态、动态下的体积称重。</strong></p>

<p align="justify">不管是海运还是空运，<br>
测量尺寸时不管是纸箱包装还是不规则的包装方式<br>
都会以最长或者最凸出来的点来测量尺寸，<br>
这个跟你实际发货的尺寸会大一些，<br>
因为运输与装卸搬运时可能会产生箱子变形，<br>
但差距基本上不会太大的，<br>
1-2cm属于正常范畴。</p>

<p> </p>`,
    prev: { title: '香港DHL和大陆DHL的区别 ?', link: '/arts_ds7' },
    next: { title: '物流的定义', link: '/arts_ds5' }
  },
  '7': {
    title: '香港DHL和大陆DHL的区别 ?',
    date: '2023-07-16',
    content: `<p>DHL中文全称翻译为：敦豪航空货运公司，是一家创立自美国，目前为德国与美国合资的速递货运公司，是目前世界上最大的航空速递货运公司之一。</p>

<p><strong>一，名称与合作伙伴不同区别</strong></p>

<p>大陆国内DHL，是敦豪公司与中外运公司合资的,自称为：中外运敦豪。 在香港，敦豪公司注册成立了敦豪国际，日常使用DHL，而为了区分香港的DHL和大陆的DHL，所以一般国内，我们就称呼香港的DHL为："香港DHL"</p>

<p> <strong> 二，价格、政策的不同与区别</strong></p>

<p>由于大陆国内DHL属于合资机构，而且目前大陆国内国际快递业务还是</p>

<p>属于比较垄断性行业，再加上国内货运资源不发达，所以目前大陆DHL的价格相对比较高。而香港作为国际货运中转地，而且竞争力相对很大，所以香港DHL的价格比较低。以一分0.5KGS的文件为例，香港DHL与大陆DHL的价格可能相差1倍左右的价格。可见，为什么很多客户为了节省成本，宁愿选择香港DHL而不选择大陆DHL。香港属于自由贸易港，在香港DHL中转的快递一般不需要报关，这样就为客户省掉了繁琐的手续，节省了宝贵的时间。</p>

<p> <strong>三，送达时间不同与区别</strong></p>

<p> 香港DHL一般是通过深圳代理报关发货到香港，再由香港DHL直接上飞机送到世界各地。而大陆DHL一般情况下，都会将货运直接送往就近的国际机场，例如广州，上海，深圳等直接上飞机，再运往世界各地。所以一般情况下，寄大陆DHL会比香港DHL的速度快上1-2天左右，但是，由于大陆的国际航班并不是很发达，很多国际航班也是经过香港中转操作，所以，除了东南亚，韩国，日本等地区大陆DHL比香港DHL快外，如果去中东，非洲，欧美等地方，两者的时效基本没有区别，因为在去一些比较远的地区，大陆的DHL也一样要先货物发到香港再进行操作。四，查询单号的区别国内DHL一般一收到快件，就会有单号，当即可以在DHL官方网站查询，而如果寄送香港DHL，就必须经过换单生成运单号，可以在DHL官方网站进行运单查询，也可以在DHL官方网站按原单号进行"按发件人参考信息查询"，一旦货物交由DHL，其他的运送时间，保险条款2者基本就没有任何区别了。香港DHL与国内DHL那种更安全，走香港DHL有风险吗？在货物交给DHL之后，二者的安全性与风险性基本没有什么不同，但是由于寄香港DHL是由大陆国内的代理公司代理将货物交给香港DHL，所以，只要选择好正规的代理公司，基本没有什么风险。</p>`,
    prev: { title: 'UPS国际快递为什么分蓝单和红单', link: '/arts_ds8' },
    next: { title: '国际快递公司是怎样测量货物尺寸的?', link: '/arts_ds6' }
  },
  '8': {
    title: 'UPS国际快递为什么分蓝单和红单',
    date: '2023-07-16',
    content: `<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">UPS国际快递是国际快递的三大巨头之一。它有许多快递产品，其中最常见的是蓝色和红色快递渠道。蓝色列表被称为UPS Worldwide expedited，被称为UPS世界快递，是UPS快递中最快、成本最低的快递方式。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: " text-align:=""><img alt="ups国际快递" src="${img_ups}" style="box-sizing: content-box; margin: 0px; padding: 0px; border: 0px; display: block; max-width: 100%;"></p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　除了UPS Worldwide expedited标记为蓝色外，还标记为红色，即红色列表的来源。一般来说，大家所说的红票是UPS Worldwidesaver-UPS快递的全球速度。红色发票通常比蓝色发票快，成本高，适合物流及时性要求高的托运人。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS国际快递的红单蓝单有什么具体区别?</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　1、服务不同。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS快递红单和蓝单享受的服务明显不同，包括及时性、稳定性、交货效率等。红单时效更快，稳定性更好，交货效率更高。蓝单时效慢，稳定性差，交货效率低。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　2、报价不同。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS快递红单和蓝单的报价也明显不同。红单快递渠道的报价普遍高于蓝单。比如把5公斤的物品送到美国，红单可能需要290元左右，但蓝单只需要260元左右，两者的报价明显不同。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　3、运输时效不同。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS快递红单的运输时效为：日本、韩国、马来西亚等东南亚地区，时效为1-3天。美国、加拿大、墨西哥、德国、法国、意大利等欧美国家的时效约为3-5天。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS快递蓝单的运输时效为：日本、韩国、马来西亚等东南亚地区，时效约为2-3天。美国、加拿大、墨西哥、英国、法国、德国、西班牙等欧美国家的时效约为3-7天。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　4、排仓难度不同。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　UPS快递红单和蓝单的排仓难度也不一样。UPS快递红单属于快递类型，与蓝单相比有优先出货的权利。当航空运输资源有限时，货物更多。UPS会先将舱位装入红单渠道，剩余舱位再装入蓝单。这意味着在发货量大的情况下，UPS快递蓝单渠道更容易排仓延误，物流时效性受到明显影响。</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　5、如何选择UPS快递红单和蓝单?</p>

<p background-color:="" cjk="" font-size:="" han="" helvetica="" hiragino="" microsoft="" noto="" pingfang="" sans="" source="" style="box-sizing: content-box; margin-right: 0px; margin-left: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; color: rgb(51, 51, 51); font-family: ">　　那么如何选择UPS快递红单和蓝单呢?UPS快递红单和蓝单在价格和及时性上有显著差异。红单价格高，及时性快，蓝单价格低，及时性慢。此外，红单旺季不易排仓，蓝单旺季更容易排仓。因此，如果托运人对物流及时性要求较高，红单是最佳选择。如果及时性要求不太高，但希望价格便宜，蓝单是最好的选择。</p>`,
    prev: { title: 'FOB、CNF、CIF指的是什么？', link: '/arts_ds9' },
    next: { title: '香港DHL和大陆DHL的区别 ?', link: '/arts_ds7' }
  },
  '9': {
    title: 'FOB、CNF、CIF指的是什么？',
    date: '2023-07-16',
    content: `<p>FOB指离岸价格亦称船上交货价格。是卖方在合同规定的港口把货物装到买方指定的运载工具上，负担货物<strong>装上运载工具为止</strong>的一切费用和风险的价格。</p>

<p><span font-size:="" microsoft="" style="color: rgb(51, 51, 51); font-family: ">CNF属于过去式了，按照《2000年国际贸易术语解释通则》规定，CFR贸易术语是Cost and Freight 的缩写（不应再使用过时的C and F、CNF 或 C+F的缩写），</span>C&amp;F（CFR）通常是指<strong>FOB+运费</strong>。卖方必须支付将货物运至指定的目的港所需的运费和费用，但交货后货物灭失或损坏的风险及由于各种事件造成的任何额外费用即由卖方转移到买方<span font-size:="" microsoft="" style="color: rgb(51, 51, 51); font-family: ">。</span></p>

<p>CIF通常是指FOB+运费+保险费。<strong>运费算到目的港</strong>，<strong>责任止于装货港</strong>。但是，在CIF条件下，卖方还必须办理买方货物在运输途中灭失或损坏风险的海运保险。因此，由卖方订立保险合同并支付保险费。买方应注意到，CIF术语只要求卖方投保<strong>最低限度的保险险别</strong>。如买方需要更高的保险险别，则需要与卖方明确地达成协议，或者自行作出额外的保险安排。CIF术语要求卖方办理货物<strong>出口清关手续</strong>。该术语仅适用于海运和内河运输。</p>

<p>FOB、CNF、CIF之间的换算：</p>

<p>1、FOB价换算为其他价CFR价=FOB价+国外运费</p>

<p>2、CIF价=（FOB价+国外运费）/（1-投保加成&times;保险费率）</p>

<p>3、CFR价换算为其他价FOB价=CFR价－国外运费</p>

<p>4、CIF价=CFR价/（1-投保加成&times;保险费率）</p>

<p>5、CIF价换算为其他价FOB价=CIF价&times;（1-投保加成&times;保险费率）－国外运费</p>

<p>6、CFR价=CIF价&times;（1-投保加成&times;保险费率）（备注：投保加成：110%，保险费率：1%）</p>`,
    prev: { title: '"CE"证明是什么？', link: '/arts_ds10' },
    next: { title: 'UPS国际快递为什么分蓝单和红单', link: '/arts_ds8' }
  },
  '10': {
    title: '"CE"证明是什么？',
    date: '2023-07-16',
    content: `<p><strong>关于&ldquo;CE&rdquo;标志</strong></p>

<p><strong>&ldquo;CE&rdquo;标志</strong>是一种安全认证标志，<strong>被视为制造商打开并进入欧洲市场的护照。</strong></p>

<p>在欧盟市场&ldquo;CE&rdquo;标志属强制性认证标志，不论是欧盟内部企业生产的产品，还是其他国家生产的产品，要想在欧盟市场上自由流通，就必须加贴&ldquo;CE&rdquo;标志，以表明产品符合欧盟《技术协调与标准化新方法》指令的基本要求。</p>

<p><strong>适用国家</strong></p>

<p>奥地利，比利时，塞浦路斯，捷克，丹麦，爱沙尼亚，芬兰，法国，德国，希腊，匈牙利，意大利，爱尔兰，拉脱维亚，立陶宛，卢森堡，马耳他，荷兰，波兰，葡萄牙，斯洛伐克，斯洛文尼亚，西班牙，瑞典，保加利亚，罗马尼亚，克罗地亚，土耳其等等。</p>

<p>&nbsp;</p>

<p><strong>再次提醒：</strong>出口到欧盟国家(包括<strong>土耳其，印度，埃及，非洲</strong>等国家)的产品，包括：电器产品、建筑产品、机械设备，<strong>都必须做CE认证，才可以清关和在当地销售。</strong></p>`,
    prev: null,
    next: { title: 'FOB、CNF、CIF指的是什么？', link: '/arts_ds9' }
  }
}

// 使用 computed 从硬编码数据获取文章
const articleData = computed(() => {
  const id = route.params.id
  return articleDatabase[id] || {
    title: '文章不存在',
    date: '',
    content: '<p>抱歉，您访问的文章不存在。</p>',
    prev: null,
    next: null
  }
})
</script>

<style scoped>
#fyw {
  background-image: url(@/assets/images/bg3.jpg);
}

@media only screen and (max-width: 480px) {
  #fyw > div {
    padding-top: 0;
  }
}
</style>
