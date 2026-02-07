<template>
  <div>
    <!-- Banner -->
    <div id="banners" :style="{ backgroundImage: `url(${bannerBg})` }">
      <div class="flex-column wrap">
        <h2>{{ mainTitle }}</h2>
        <p>{{ subTitle }}</p>
      </div>
    </div>

    <!-- 面包屑导航 -->
    <div id="bnav">
      <div class="wrap">
        <router-link to="/">首页</router-link>&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <router-link to="/news">新闻中心</router-link><template v-if="newsData.category">&nbsp;&nbsp;&gt;&gt;&nbsp;&nbsp;
        <strong>{{ categoryName }}</strong></template>
      </div>
    </div>
    <div id="bnav-m">
      <router-link to="/">首页</router-link>
      <i class="layui-icon layui-icon-right"></i>
      <router-link to="/news">新闻中心</router-link>
      <template v-if="newsData.category">
      <i class="layui-icon layui-icon-right"></i>
      <strong>{{ categoryName }}</strong>
      </template>
    </div>

    <!-- 新闻内容 -->
    <div id="content" class="wrap">
      <div id="news_info">
        <h1>{{ newsData.title }}</h1>
        <p>
          <span v-if="newsData.category">{{ newsData.category }}</span>
          <span v-if="newsData.author"><i class="layui-icon layui-icon-username"></i>{{ newsData.author }}</span>
          <span><i class="layui-icon layui-icon-time"></i>{{ newsData.date }}</span>
        </p>
      </div>
      <div class="editorc_box">
        <div class="editorc editorc_tbe" v-html="newsData.content"></div>
      </div>

      <!-- 上一篇/下一篇 -->
      <div id="prevnext">
        <p v-if="newsData.prev">
          上一篇：<router-link :to="newsData.prev.link">{{ newsData.prev.title }}</router-link>
        </p>
        <p v-else>上一篇：没有了</p>

        <p class="gots" v-if="newsData.next">
          下一篇：<router-link :to="newsData.next.link">{{ newsData.next.title }}</router-link>
        </p>
        <p v-else class="gots">下一篇：没有了</p>

        <router-link :to="backLink" id="prevnext_back">
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

import defaultBannerBg from '@/assets/uploadfiles/20230706-135232.jpg'

const { bannerBg, mainTitle, subTitle } = useBannerData('news-detail', {
  bannerBg: defaultBannerBg,
  mainTitle: '新闻详情',
  subTitle: '了解翔宇达最新动态'
})

// 导入所有图片
import img_20230926_144402 from '@/assets/uploadfiles_xyd/images/20230926_144402.jpg'
import img_20230926_144459 from '@/assets/uploadfiles_xyd/images/20230926_144459.jpg'
import img_20230926_144621 from '@/assets/uploadfiles_xyd/images/20230926_144621.jpg'
import img_20230926_144740 from '@/assets/uploadfiles_xyd/images/20230926_144740.jpg'
import img_20230926_144757 from '@/assets/uploadfiles_xyd/images/20230926_144757.jpg'
import img_20230926_144822 from '@/assets/uploadfiles_xyd/images/20230926_144822.jpg'
import img_20230926_144841 from '@/assets/uploadfiles_xyd/images/20230926_144841.jpg'
import img_20230926_144928 from '@/assets/uploadfiles_xyd/images/20230926_144928.jpg'
import img_20230719_182435 from '@/assets/uploadfiles_xyd/images/20230719_182435.jpg'
import img_20230719_182608 from '@/assets/uploadfiles_xyd/images/20230719_182608.jpg'
import img_20230719_182730 from '@/assets/uploadfiles_xyd/images/20230719_182730.jpg'
import img_20230712_103411 from '@/assets/uploadfiles_xyd/images/20230712_103411.jpg'
import img_20210517_152601 from '@/assets/uploadfiles_xyd/images/20210517_152601.png'
import img_20210517_150640 from '@/assets/uploadfiles_xyd/images/20210517_150640.png'
import img_20230719_182116 from '@/assets/uploadfiles/20230719-182116.jpg'
import img_20210508_155820 from '@/assets/uploadfiles_xyd/images/20210508_155820.png'
import img_20210528_113835 from '@/assets/uploadfiles_xyd/images/20210528_113835.jpg'
import img_20210528_114401 from '@/assets/uploadfiles_xyd/images/20210528_114401.png'
import img_20210528_115015 from '@/assets/uploadfiles_xyd/images/20210528_115015.png'
import img_20210608_145147 from '@/assets/uploadfiles_xyd/images/20210608_145147.png'
import img_20210610_115158 from '@/assets/uploadfiles_xyd/images/20210610_115158.png'
import img_20210610_115424 from '@/assets/uploadfiles_xyd/images/20210610_115424.png'
import img_20210610_115854 from '@/assets/uploadfiles_xyd/images/20210610_115854.png'
import img_20210610_120127 from '@/assets/uploadfiles_xyd/images/20210610_120127.png'
import img_20210619_161247 from '@/assets/uploadfiles_xyd/images/20210619_161247.png'
import img_20210714_141155 from '@/assets/uploadfiles_xyd/images/20210714_141155.jpg'
import img_20210520_182721 from '@/assets/uploadfiles_xyd/images/20210520_182721.jpg'
import img_20210520_182639 from '@/assets/uploadfiles_xyd/images/20210520_182639.png'

// 硬编码的新闻数据库
const newsDatabase = {
  '17': {
    title: '深圳市翔宇达运通国际货运代理有限公司当选福海快递物流协会常务副会长单位！',
    category: '公司新闻',
    author: '聂辉凡',
    date: '2023-09-26',
    views: 312,
    content: `
    <p style="margin-bottom: 24px; font-size: 14px; letter-spacing: 0.544px; text-align: justify;">
      <span style="color: rgb(25, 25, 25); font-size: 14px; letter-spacing: 0.544px;">2023年9月22日，福海快递物流协会举办了第一届一次会员大会暨启动仪式，地点深圳国际会展中心希尔顿酒店。来自行业内的会员单位汇聚一堂，共同探讨了可持续发展的最新趋势与挑战。作为本次大会的重要支持者，深圳市翔宇达运通国际货运代理有限公司受邀出席。</span>
    </p>
    <p style="margin-bottom: 24px;">
      <img src="${img_20230926_144459}" alt="">
    </p>
    <p style="margin-bottom: 24px; font-size: 14px; letter-spacing: 0.578px; line-height: 1.6em;">
      <span style="font-size: 14px; letter-spacing: 0.578px;">在大会现场隆重的氛围中，舞蹈和歌曲的画面交织成一幅令人陶醉的画卷。</span>
    </p>
    <p style="margin-bottom: 24px;">
      <img src="${img_20230926_144621}" alt="">
    </p>
    <p style="margin-bottom: 24px; font-size: 14px; letter-spacing: 0.578px; line-height: 1.6em;">
      <span style="font-size: 14px; letter-spacing: 0.578px;">这次盛会不仅迎来了福海街道办领导，还聚集了协会会员单位的代表，他们共同选举产生了协会的领导团队。</span>
    </p>
    <p style="margin-bottom: 24px;">
      <img src="${img_20230926_144740}" alt=""><img src="${img_20230926_144757}" alt="">
    </p>
    <p style="margin-bottom: 24px; font-size: 14px; letter-spacing: 0.578px;">
      <span style="letter-spacing: 0.578px;">通过所有会员单位的投票选举，在福海街道办领导的共同见证下，深圳市翔宇达运通国际货运代理有限公司董事长黄桥忠当选为福海街道快递物流协会第一届理事会常务副会长、深圳市翔宇达运通国际货运代理有限公司当选为常务副会长单位。作为协会的常务副会长单位之一，翔宇达将积极探索市场与信息的结合，为促进物流行业的创新作出贡献。</span>
    </p>
    <p style="margin-bottom: 24px;">
      <img src="${img_20230926_144822}" alt=""><img src="${img_20230926_144841}" alt="">
    </p>
    <p style="margin-bottom: 24px; font-size: 14px; letter-spacing: 0.578px;">
      <span style="letter-spacing: 0.578px; font-size: 14px;">可持续性是现代物流行业的重要关键词。供应链的透明度和可靠性也是现代物流行业的重要目标。综合来说，现代物流行业正在朝着智能化、可持续化和高效化方向发展，以满足不断增长的全球物流需求，提高生产效率，实现可持续发展。</span>
    </p>
    <p style="margin-bottom: 24px;">
      <img src="${img_20230926_144928}" alt="">
    </p>
    <p style="margin-bottom: 24px; font-size: 14px;">
      <span style="font-size: 14px;">行业融合、共享共创、凝聚发展，在福海快递物流协会的带领下，行业福海街道将朝着更加创新、更加健康的方向发展，翔宇达也会为行业进步尽自己最大力量。</span>
    </p>
    <section style="margin: 0px; padding: 0px; display: inline-block; vertical-align: middle; width: 190.734px;">
      <section style="margin: 10px 0px; padding: 0px; line-height: 0;">
        <section style="margin: 0px; padding: 0px; vertical-align: middle; display: inline-block; line-height: 0;">
          <img src="${img_20230926_144402}" alt="" style="margin: 0px; padding: 0px; vertical-align: middle;">
        </section>
      </section>
    </section>
    <section style="margin: 0px; padding: 0px; display: inline-block; width: 381.469px; vertical-align: middle; background-color: rgb(95, 156, 239);">
      <section style="margin: 0px; padding: 0px;">
        <section style="margin: 0px; padding: 0px 20px; font-size: 14px; color: rgb(255, 255, 255); line-height: 1.6;">
          <p style="margin: 0px; padding: 0px; min-height: 1em;">
            <span style="font-size: 15px;"><strong>扫描二维码，关注我们的公众号</strong></span>
          </p>
          <p style="margin: 0px; padding: 0px; min-height: 1em;">&nbsp;</p>
          <p style="margin: 0px; padding: 0px; min-height: 1em;">
            <strong><span style="font-size: 15px;">视频号：</span></strong><span style="font-size: 15px;">翔宇达运通国际</span>
          </p>
          <p style="margin: 0px; padding: 0px; min-height: 1em;">
            <strong><span style="font-size: 15px;">抖音：</span></strong><span style="font-size: 15px;">翔宇达运通国际物流</span>
          </p>
        </section>
      </section>
    </section>
    `,
    prev: null,
    next: { title: '燃情驱动，凝聚力UP！翔宇达国际物流业务部团建', link: '/news_ds-15' }
  },
  '15': {
    title: '燃情驱动，凝聚力UP！翔宇达国际物流业务部团建',
    category: '公司新闻',
    author: '聂辉凡',
    date: '2023-07-09',
    views: 234,
    content: `
    <p>燃情驱动，凝聚力UP！</p>
    <p>— 翔宇达国际物流业务部团建 —</p>
    <p>惠州南昆山</p>
    <p>亲爱的小伙伴们，周末到啦！翔宇达国际物流业务部为了增进团队的凝聚力、激发大家的工作热情，特别策划了一次精彩绝伦的团建活动！什么是快乐星球，现在我就带你研究。</p>
    <p><img alt="" src="${img_20230719_182116}" style="height: 450px; width: 800px;"></p>
    <p><strong>1.欢乐自驾游</strong></p>
    <p><img alt="" src="${img_20230719_182435}" style="width: 800px; height: 449px;"></p>
    <p>时间不等人，周六中午我们自驾前往惠州南昆山，迎接一场轻松愉快的两天团建之旅。把开车作为一项团队活动，不仅加强了沟通合作，还增进了彼此的了解与友谊。</p>
    <p><strong>2.表彰会</strong></p>
    <p>下午的会议环节将对上一季度的工作进行总结。我们将集思广益，探讨碰到的问题，并为出色表现者颁发荣誉奖励。同时，对存在的问题进行反思，为未来第二季度的工作制定全新规划。</p>
    <p><img alt="" src="${img_20230719_182608}" style="width: 800px; height: 450px;"></p>
    <p><strong>3Party time！</strong></p>
    <p>晚上，我们举行烧烤派对！在户外烤肉的欢声笑语中，大家可以尽情享受美食，放飞自我。而随后的民宿KTV活动，则为我们提供了一个展现才艺的舞台，让我们尽情释放压力，畅快歌唱。</p>
    <p><img alt="" src="${img_20230719_182730}" style="width: 800px; height: 450px;"></p>
    <p>本次团建活动的目标就是让大家减轻工作压力，在轻松快乐的氛围中工作、挣钱。我们坚信，这样的团队活动将进一步凝聚我们团队的力量，激发创造力和合作精神，帮助我们在竞争激烈的市场中脱颖而出。</p>
    `,
    prev: { title: '深圳市翔宇达运通国际货运代理有限公司当选福海快递物流协会常务副会长单位！', link: '/news_ds-17' },
    next: { title: '我国外贸数据逐月向好，背后因素是什么？', link: '/news_ds-10' }
  },
  '14': {
    title: '涨价！集装箱一舱难求！出口企业发货难…',
    category: '行业动态',
    author: 'admin',
    date: '2023-07-01',
    views: 278,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp; &nbsp; &nbsp; 根据上海航运交易所公布的最新数据，截至7月2日，中国出口集装箱运价指数报2653.32，较6月25日的2591.41，上升了2.4%，同时，各大集装箱海运公司也公布了集装箱7月初的基准运价表，显示多条航线集装箱运价有所上涨，国际集装箱运价因何再次上调，这又会给相关行业带来哪些影响呢？记者在上海进行了调查。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp; &nbsp; &nbsp; 从7月1日起，航运公司对航线报价进行了新一轮的调整，虽然一些近洋航线呈现下滑趋势，但是<strong>多数远洋航线都有提价预期</strong>，以中国发往欧洲主要目的港基准运价为例：7月1日，标准集装箱基准运价报7300美元/箱，较前一周6月25日的报价：6600美元/箱，涨幅超过了10%。同样，大箱基准价报13600美元/箱，与前一周报价相比，涨幅超过了7%。从业30多年的郭绍海表示他从未经历过这种运价连涨的情况，他告诉记者，<strong>影响国际集装箱运价的因素较多，最主要的是承运的货量和目的港的疏运效率。</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp; &nbsp; &nbsp; 部分目的港疏港效率的下降，直接造成了货轮跳港到附近港口，再经过陆运或短驳船转运至目的港，大幅增加了航运公司成本。前期积压的集装箱急需疏港和转运，叠加货运订单仍在增加，导致部分目的港压力短期内难以缓解，推升了近期的国际集装箱运价。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210714_141155}" style="width: 900px; height: 447px;"></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>订单多发货难 出口企业加价订舱</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>&nbsp; &nbsp; &nbsp;&nbsp;</strong>此轮集装箱运价上涨的背后，对应的是集装箱舱位供给不足，这对于出口企业的出货有着哪些影响，货代企业又将面临哪些挑战？</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp; &nbsp; &nbsp; 高运价也影响到了一些出口企业订单交付的速度，一部分货值偏低的产品，只能暂时堆放在中转仓库，这会对仓储端带来哪些影响？</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp; &nbsp; &nbsp; 我国海关总署的数据显示：2021年5月我国出口总金额为2639.22亿美元，较去年同期的2064.31亿美元增长了23.4%。随着我国出口的增加，集装箱吞吐量也屡创新高，今年1-5月，我国八大枢纽港集装箱吞吐量达2.3亿标准箱，较去年同期的1.96亿标准箱增长了17.1%。业内人士表示，随着各地疫情的好转，国际集装箱有效运力正在恢复，港口的拥堵情况将在四季度有所缓解。</p>`,
    prev: { title: '2023年五一劳动节放假通知', link: '/news_ds-16' },
    next: { title: '欧盟增值税新规则，2021年7月1日起生效', link: '/news_ds-13' }
  },
  '10': {
    title: '我国外贸数据逐月向好，背后因素是什么？',
    category: '行业动态',
    author: '聂辉凡',
    date: '2023-04-25',
    views: 156,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">4月13日，海关总署公布今年一季度外贸数据。一季度我国货物贸易进出口同比增4.8%。1月，我国进出口下降7%，2月&ldquo;由负转正&rdquo;，当月增长8%，3月同比增速提升到15.5%。在经历了一月份的增速下降之后，一季度出现了逐月向好的结果，在这背后是哪些因素起了作用？接下来，实现全年外贸的促稳提质，还有哪些挑战需要应对？</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>2023年一季度外贸表现如何？成绩单出炉</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">4月13日，海关总署公布一季度外贸数据，一季度我国货物贸易进出口总值9.89万亿元人民币，同比增长4.8%。一季度外贸数据有哪些亮点？数据的背后又透露出哪些信息？</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>如何看待一季度我国对东盟进出口同比增长16.1%，高出整体增速11.3个百分点？</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>中国国际经济交流中心首席研究员 张燕生：</strong>在2007年金融危机之前，我们的贸易伙伴中，东盟是在第四位。之所以能够上升到第一位，最重要的原因：①我国实施了&ldquo;双循环&rdquo;战略，&ldquo;双循环&rdquo;战略的主战场实际上还是东亚、东南亚等周边地区。②我们把握住了全球经济重心东移的机遇。③在新阶段，中国的产业链供应链正根据当前复杂的国际国内环境，主动转移、配置、延伸到东盟地区，这个趋势反映出我们未来30年外贸高质量发展的一个重要方面。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>电动载人汽车、太阳能电池、锂电池，外贸&ldquo;新三样&rdquo; 未来前景看好</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>中国国际经济交流中心首席研究员 张燕生：</strong>&ldquo;新三样&rdquo;很大程度反映了全球和中国的一场绿色革命、数字革命和创新革命。无论是第四次工业革命，还是新一轮的绿色革命，中国实际上都紧紧进入了世界的前沿。因此&ldquo;新三样&rdquo;都是中国在绿色革命、能源革命和数字革命中出现的新的国际合作竞争新优势。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>稳外贸，如何稳住对发达经济体的出口？</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>中国国际经济交流中心首席研究员 张燕生：</strong>去年中国的出口伙伴国和地区中，美国、欧盟、东盟三个重要的出口伙伴，他们占我们总出口的比重是非常接近的。目前对美出口是我们第一大市场，但是现在我们对美国出口增长最快的还是像玩具这些劳动密集型和传统出口产品，而美国对我们出口更多的还是像大豆、玉米、粮食。也就是中美两个大国的出口模式，产品的结构都是非常传统的，之所以会产生这个结果，最重要的就是地缘政治。在这种情况下，在稳出口市场的时候，我觉得美国市场重要，但是更重要的就是要稳住东盟市场和欧盟市场、日本市场、韩国市场。我们还要开展全方位国际合作，来稳住其他发达国家的出口市场。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>稳外贸，如何继续挖掘和RCEP伙伴国之间的潜力？</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>中国国际经济交流中心首席研究员 张燕生：</strong>RCEP实际上是有三个经济合作圈。一个经济合作圈就是中国和东盟，重点还是把中国的产业链、供应链、贸易链延伸到东盟地区，也就是它是我们区域市场一体化的重点。第二个部分就是日韩。中日韩三个国家将决定东亚生产方式和东亚生产网络，因此这个部分的合作是非常关键的。第三个就是澳大利亚、新西兰。澳大利亚、新西兰对中国保障出口产品的安全是至关重要的。而且这里有一个重大的机遇，就是全球经济重心东移，包括需求、供给、创新、服务、资本、货币和金融合作。因此做好RCEP这篇大文章，事关中国外贸的高质量发展和整个中国式现代化建设战略的全局。</p>`,
    prev: { title: '燃情驱动，凝聚力UP！翔宇达国际物流业务部团建', link: '/news_ds-15' },
    next: { title: '2023年五一劳动节放假通知', link: '/news_ds-16' }
  },
  '16': {
    title: '2023年五一劳动节放假通知',
    category: '公司新闻',
    author: '聂辉凡',
    date: '2023-04-24',
    views: 189,
    content: `
    <p>
      <img src="${img_20230712_103411}" alt="">
    </p>
    `,
    prev: { title: '我国外贸数据逐月向好，背后因素是什么？', link: '/news_ds-10' },
    next: { title: '涨价！集装箱一舱难求！出口企业发货难…', link: '/news_ds-14' }
  },
  '13': {
    title: '欧盟增值税新规则，2021年7月1日起生效',
    category: '行业动态',
    author: 'admin',
    date: '2021-06-19',
    views: 245,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">针对欧盟27国的《增值税指令》将于2021年7月1日起正式生效</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">1、废除远程销售起征额 （适用于全欧范围年销售额超过阈值1万欧元），取消22欧元的增值税免征额</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">自7月1日起，欧盟27国将取消货物申报价值不超过22欧元的免征增值税（VAT）政策，即所有进口至欧盟的商品，都将被征收增值税。欧盟税改主要影响的是申报价值不超过150欧元的货物。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">2、推出一站式（One-Stop-Shop或OSS）注册申报服务，启用IOSS一站式增值税申报服务平台</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">申报价值在150欧元以下货物，可通过注册欧盟推出的&ldquo;进口一站式服务方案（IOSS）&rdquo;进行增值税在线申报和快速清关，IOSS可简化货物进口欧盟国家的清关及支付进口VAT的流程，在商品进口到欧盟时，收件人无需再支付预期之外的增值税。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">将一站式机制试用范围从欧盟国家扩大到非欧盟国家。非欧盟国家供应商只需在一个欧盟国家注册，就可一次性申报缴纳在所有欧盟成员国发生的税款。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">现有的&ldquo;远程销售门槛&rdquo;将被撤销，随后会推出&ldquo;一站式&rdquo;欧盟增值税申报表（OSS）。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">在线销售商品的企业通过在线数字门户网站（MOSS）履行应该遵守的所有增值税义务的新规则，并通过其欧盟注册所在国当地税务部门系统进行申报。单个欧盟销售目的国所涉及的年销售额如果超过阈值10，000欧元，则需要按照欧盟各目的国增值税税率执行，可以使用MOSS系统做统一申报。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">3、终止低于22欧元的进口增值税豁免政策，由电商平台或者海关申报人负责收取和缴纳增值税</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">电商卖家将被视为平台的供应商，电商卖家可使用平台的IOSS号进行申报，由平台代扣代缴VAT税金。如果卖家为自建电商平台，可自行注册IOSS。</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">4、税改政策涵盖欧盟27国</p>
    <p align="justify" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">包括：奥地利、比利时、保加利亚、克罗地亚、塞浦路斯、捷克、丹麦、爱沙尼亚、芬兰、法国、德国、希腊、匈牙利、爱尔兰、意大利、拉脱维亚、立陶宛、卢森堡、马耳他、荷兰、波兰、葡萄牙、罗马尼亚、斯洛伐克、斯洛文尼亚、西班牙、瑞典。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>欧盟各国增值税率</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">英国VAT增值税有三种税率：</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">20% 的标准税率（适用于绝大多数商品和服务）</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">5% 的低税率（比如家庭用电或者汽 油等）</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">0% 的税率（适用于极个别情况）</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">其他欧盟国的标准税率:</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">德国：19%</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">法国：20%</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">意大利：22%</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">西班牙：21%</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>增值税计算举例</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">商品的价格是包含 VAT增值税的，比如你在英国一件产品最终售价应该是 120镑， 20镑是此产品销售后的 VAT增值税。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">例如：</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">①申报货值=100件*100镑/件=10000镑,</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">②头程运费2000镑 DUTY=10000*3.7%</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">③进口增值税 IMPORT VAT =（申报货值 + 头程运费 +DUTY）X 20% =（10000+2000+370）X20% = 2474 镑</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">这个进口增值税 2474镑在季度申报时可抵扣销售税。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">销售分 3个情况做个分析：</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">①没有任何销售</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">销售税为0，净退税 2474镑</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">②货物全部售出</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">销售额20000镑，销售税为 20000/6=3333.3,</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">应缴税为3333.3-2474=859.3镑</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">③货物部分一半</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">退货在清关及相关证明文件齐全的情况下是算库存，无需缴纳销售税。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>06</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>国内增值税与VAT区别</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong><img alt="" src="${img_20210619_161247}" style="width: 900px; height: 419px;"></strong></p>`,
    prev: { title: '涨价！集装箱一舱难求！出口企业发货难…', link: '/news_ds-14' },
    next: { title: '跨境电商大卖环球易购被申请破产', link: '/news_ds-12' }
  },
  '12': {
    title: '跨境电商大卖环球易购被申请破产',
    category: '行业动态',
    author: 'admin',
    date: '2021-06-10',
    views: 198,
    content: `<p>在《全国企业破产重整案件信息网》上，我们看到了破产案件号。</p>
    <p><br>深圳市环球易购电子商务有限公司在6月4日被中国工商银行股份有限公司深圳南山支行申请破产。</p>
    <p><br><img alt="" src="${img_20210610_115158}" style="width: 1080px; height: 355px;"></p>
    <p><br>《全国企业破产重整案件信息网》是最高人民法院建立的，具有权威性。</p>
    <p><br>首家跨境电商上市企业</p>
    <p>2011年，已在跨境电商领域耕耘数年的环球易购获得5千万A轮融资。同年12月，百圆裤业则登陆资本市场，成为A股第一家专注于裤装的上市公司。2014年，百圆裤业创始人杨建新斥资10亿元，收购跨境电商公司环球易购，意图向跨境电商转型。</p>
    <p><br>2015年6月，&ldquo;百圆裤业&rdquo;正式更名为&ldquo;跨境通&rdquo;，成为A股首家上市的跨境电商企业。此后，它不断展现财技，持续收购跨境电商资产。到2018年，跨境通还实现了对帕拓逊 100%股份的收购。</p>
    <p><img alt="" src="${img_20210610_115424}" style="width: 699px; height: 584px;"></p>
    <p><br>对环球易购而言，虽然有资本的背书，沉重的对赌协议压力也随之而来。</p>
    <p>环球易购在2017年下半年存货备货增大，存货余额较上年末增加约13亿元；又在2018年遭遇流动性趋紧，在外部银行融资政策收紧的情况下，三季度和四季度银行渠道融资减少约7亿至8亿元，使得第四季度销售旺季，未能如预期进行广告投入和促销推广，部分历史存货错过了销售的最佳时机。</p>
    <p><br>之后的2019年跨境通净利润更是遭遇滑铁卢，营收178.74亿元，同比下降16.99%，亏损27.08亿。对于亏损的原因，跨境通在公告中表示，主要系公司对存货坏账准备的计提。跨境通年报显示，2019年，跨境通的公司大额计提资产减值了约28.7亿。</p>
    <p><br>对此，跨境通解释，一方面是积极拓展主业所致，跨境电商业务进行营销推广、备货周转、供应链建设均需有较为充足的运营资金；另一方面，先后参股帕拓逊等企业，其中公司自2015年至2018年期间分四次以累计 10.27亿元完成对帕拓逊 100%股份的收购，运营资金转化为投资资金沉淀。</p>
    <p><br>到了2020年，问题急迫了起来。跨境通称，为解决资金需求问题，公司通过发行公司债、银行借款、股东借款等多种方式进行融资。</p>
    <p><br>2020年以来，环球易购因 2019 年业绩亏损受金融机构削减授信额度、部分债务到期后无法续期，2020年环球易购偿还银行等金融机构债务合计11.50亿元致使筹资活动产生的现金流量净额由2019年的7.55亿元降至2020年的-4.40 亿元，偿还债务进一步占用了公司运营资金。</p>
    <p>在环球易购走下坡路的这几年，安克创新、SheIn异军突起，成为资本市场上的宠儿。</p>
    <p><br>内部管理混乱也是他在环球易购工作期间遇到的障碍之一。万宁曾经尝试在环球易购内部重新梳理打通供应链，结果发现整个供应链被拆得四分五裂，这使他的尝试遇到了重重阻力。</p>
    <p><br>2021年，跨境电商行业风波又起，建仓难，运费高企，都会给卖家和物流商造成极大的资金压力，而往往一个大公司会因为一点点小小的资金断裂导致连锁反应，造成最后不可收拾的局面。</p>
    <p><img alt="" src="${img_20210610_115854}"></p>
    <p style="text-align: center;">共克时艰，共赢商机！关注时事，更要关注翔宇达，你身边的国际物流综合方案提供商！翔宇达，使命必达！</p>
    <p style="text-align: center;"><img alt="" src="${img_20210610_120127}" style="width: 429px; height: 512px;"></p>
    <p>&nbsp;</p>`,
    prev: { title: '欧盟增值税新规则，2021年7月1日起生效 ', link: '/news_ds-13' },
    next: { title: '盐田港将延迟14天，加价$3000也可能抢不到集装箱', link: '/news_ds-1' }
  },
  '1': {
    title: '盐田港将延迟14天，加价$3000也可能抢不到集装箱',
    category: '行业动态',
    author: 'admin',
    date: '2021-06-08',
    views: 267,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">随着深圳和广州新冠确诊病例的出现，这场广东地区的局部疫情已经严重影响到华南地区的外贸出货情况。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">由于现有深圳确诊个案均在盐田港国际货轮作业传播链上，目前盐田港的消毒检疫力度依旧很强。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">而受到盐田港拥堵和跳港影响，平时从盐田出海的大量华南货物改道蛇口港和南沙港。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">如今全球海运业可谓&ldquo;冰火两重天&rdquo;，海外多国疫情严峻，人工不足，港口集装箱堆积如山；亚洲各大港口运输繁忙，却时常受&ldquo;缺箱&rdquo;&ldquo;少柜&rdquo;困扰，集装箱价格飞涨，一些海运航线上涨近10倍，仍然是&ldquo;一箱难求&rdquo;。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210608_145147}" style="width: 1000px; height: 757px;"></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>全球经济复苏 中国制造业拉动海运需求</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">这拨海运行业的涨价潮，受多重因素影响，比如，海外严峻的疫情、苏伊士运河的阻塞，都让海运行业压力倍增。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">随着全球经济复苏，各国贸易需求大增，由于中国疫情的有效控制，在全球产业链中，中国制造业承担着重要的责任。数据显示：今年前4个月中国贸易货物进出口总值比2020年同期增长28.5%，比2019年同期增长21.8%。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">虽然苏伊士运河堵塞事件已经过去了2个月，但其后续影响余波未了。加上新冠疫情叠加效应，由此导致运期混乱、港口拥堵的现象正在全球各处上演。新西兰奥克兰港口外在锚地等待进港装卸货物的集装箱船有时多达10多艘，平均延误船期8到10天。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">据央视报道，从去年三季度以来，国内的众多港口几乎都面临着缺箱少柜的现象，哪怕是涨价近10倍，也还是&ldquo;一箱难求&ldquo;；更令人气愤的是，有些黑心黄牛趁机坐地起价，导致有些航线加价3000美元也有可能抢不到一个集装箱，眼看着大促即将到来，但商家却面临着有货发不出的困境。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">此次华南地区拥堵带来的严重延误，直接造成的后果就是<strong>近十天运费上涨了约2000美元至1.2万美元。</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">根据目前全球海运情况来看，下半年的海运情况依然不容乐观，短期内高涨的海运市场无法消退，甚至有较大概率将再创新高。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">欧美下半年9月至12月的销售旺季即将到来，而拥堵依旧在继续，如果接下来一段时间里的海运情况不能得到有效缓解，恐将危及卖家出货欧美旺季。</p>`,
    prev: { title: '跨境电商大卖环球易购被申请破产', link: '/news_ds-12' },
    next: { title: '关于海运延迟开船通知', link: '/news_ds-2' }
  },
  '2': {
    title: '关于海运延迟开船通知',
    category: '公司新闻',
    author: 'admin',
    date: '2021-05-28',
    views: 223,
    content: `<p><img alt="" src="${img_20210528_113835}" style="width: 100px; height: 100px;"> 深圳市翔宇达运通国际货运代理有限公司</p>
    <hr>
    <p align="center"><span style="font-size: 20px;"><strong>关于海运延迟开船通知</strong></span></p>
    <p align="center">&nbsp;</p>
    <p>尊敬的客户：</p>
    <p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 受疫情影响，盐田码头已经接近崩溃，5月28日00:00开始将暂停接收出口重柜，直到5月30日24:00恢复，届时大船都会延误开船所有盐田出的货物将会受到不同程度的影响（万海、以星），我司会密切跟踪盐田港情况，待码头开放后尽力安排最近一水船，请客户根据实际需求提前做好出货计划。</p>
    <p>附件（盐田港最新通知）：</p>
    <p style="text-align: center;"><img alt="" src="${img_20210528_114401}" style="width: 775px; height: 480px;"></p>
    <p style="text-align: center;"><img alt="" src="${img_20210528_115015}" style="width: 300px; height: 364px;"></p>
    <p style="text-align: center;">&nbsp;</p>
    <p>&nbsp;</p>
    <p style="text-align: right;">深圳市翔宇达运通国际货运代理有限公司</p>
    <p align="right">2021年5月28日</p>
    <p align="right">&nbsp;</p>`,
    prev: { title: '盐田港将延迟14天，加价$3000也可能抢不到集装箱', link: '/news_ds-1' },
    next: { title: '出口集装箱依旧短缺，或将持续到2022年！', link: '/news_ds-3' }
  },
  '3': {
    title: '出口集装箱依旧短缺，或将持续到2022年！',
    category: '行业动态',
    author: 'admin',
    date: '2021-05-27',
    views: 201,
    content: `<p>受疫情影响，国外集装箱货物进口空前繁荣，造成港口持续拥堵。</p>
    <p>据了解，中国发往美国海上集装箱大增46.5％，增至98万7834个，海洋货运的需求在不断增加，造成了集装箱短缺和延误到达。从2020年底至今，集装箱的价格在3500美元左右，近几周所有的贸易航线的即期价格也创下历史新纪录。</p>
    <p>面对一箱难求的局面，集装箱船航运公司认为，到第四季度可能会回到疫情之前的水平。但也有集装备租赁商认为可能会持续到2022年，因为他们觉得没有迹象可以表明供应紧张情况在缓解。</p>
    <p>随着港口拥堵状况的缓解，以及今年集装箱产量在急剧上升，当前全球集装箱紧张的局面应该会得到缓解。&nbsp;</p>
    <p><strong>在目前形势紧张的情况下，很考验卖家处理各种风险的能力，卖家可以提前做好准备，合理调整运营计划，减少不必要的损失。</strong></p>
    <p>&nbsp;</p>`,
    prev: { title: '关于海运延迟开船通知', link: '/news_ds-2' },
    next: { title: '5月25日22:00起闸口有限作业', link: '/news_ds-11' }
  },
  '11': {
    title: '5月25日22:00起闸口有限作业',
    category: '行业动态',
    author: 'admin',
    date: '2021-05-26',
    views: 178,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">各位客户：</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">由于船期延误日趋严重，导致盐田港区堆场堆存密度极高，严重影响码头操作效率，也导致港区周边交通拥堵。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">为改善上述问题，盐田国际决定：</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">1、5月25日22:00至5月27日23:59期间，不接收出口重柜入闸；在此期间，<strong><u>提进口重柜及空柜维持正常操作</u></strong>。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">2、5月28日00:00时起恢复接收重柜，只接收ETA-4（即船舶预计到港日期前四天内）的出口重柜。此措施实施时间为5月28至6月3日。</p>`,
    prev: { title: '出口集装箱依旧短缺，或将持续到2022年！', link: '/news_ds-3' },
    next: { title: '疯涨十倍！运价一周飙升1500美金，再创历史新高', link: '/news_ds-9' }
  },
  '9': {
    title: '疯涨十倍！运价一周飙升1500美金，再创历史新高',
    category: '行业动态',
    author: 'admin',
    date: '2021-05-20',
    views: 289,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">简介：为何我眼里常含泪水，因为运费涨价涨到心寒！</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">涨！涨！涨！可以说是运价在今年最真实的写照。当很多人都以为运价已经在一定程度上涨到顶了的时候，运价却接二连三实现新突破。无数卖家面对高涨的运价只能长叹：&ldquo;为何我眼里常含泪水，因为运费涨价涨到心寒！&rdquo;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>集装箱运价突破新天际</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">是的，在本周，亚洲到欧洲的集装箱运价再次创下历史新高！</p>
    <p align="center" style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210520_182721}" style="width: 1000px; height: 540px;"></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">本周一Platts Container Rate 1显示，北亚至北欧大陆的集装箱运价已经飙升至12000美元/FEU，较前一周上涨了1500美元/FEU，与去年在该航线上评估的1300美元/FEU相比，几乎呈10倍数的增长。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">除此之外，北亚至英国的集装箱价格也创下历史新高，飙升至14500美元/FEU，与去年的1325美元/FEU形成鲜明对比。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">全世界都可以清晰感受到全球主要航线的需求远大于供应带来的苦恼。在2020年初，一些集装箱卸货后大约只需要7到10天。而如今，则足足需要4周才能返回港口。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">除了求大于供等因素，国外港口的相继沦陷也使得集装箱流通速度大幅下降，继而加剧集装箱供给需求，加速形成恶性循环。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>延误、起火情况频出</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">根据ONE发布的消息，旗下一艘名为&ldquo;NYK Delphinus号&rdquo;的集装箱船在5月14日发生火灾。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">据悉，该船在行驶至加州蒙特利海岸以西约50英里处时机舱失火，但火势很快便得到控制。据通报，该船所有船员均无损伤，目前也没有有关货物损坏的信息。火灾事故发生之后，该船将停靠在奥克兰港，等待美国当局完成船舶评估。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>除了频频起火，新冠疫情也严重干扰着航海业的正常运行。</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">继马士基一艘集装箱船在前往盐田途中发现2位船员感染新冠之后，一艘名为&ldquo;SINGAPORE BRIDGE&rdquo;集装箱船在前往蛇口途中发现有船员出现疑似感染新冠的症状，目前越南当局已协助将船员上岸进行紧急治疗。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">据悉，此集装箱船将挂靠蛇口、上海、宁波、香港等多个中国港口，共舱船司有阳明海运、万海航运。而截至5月16日，SINGAPORE BRIDGE轮仍在归仁港港界内漂航（没有锚泊和靠泊），船期延误看来是在所难免！</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">如果有货物搭载以上船只的卖家也要及时与货代联系，及时了解货损以及船期延误的具体情况，以免造成更多损失。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">就目前整个物流行业的情况来看，集装箱船缺仓缺箱、船舶延误等问题将继续限制航运市场，而且该情况可能将持续至今年第四季度。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210520_182639}" style="width: 328px; height: 329px;"></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>更多精彩内容,请关注</strong><strong>翔宇达运通国际微</strong><strong>信公众号：（</strong><strong>XYDYTGJ</strong><strong>）</strong></p>`,
    prev: { title: '5月25日22:00起闸口有限作业', link: '/news_ds-11' },
    next: { title: '关于义乌分公司搬迁通告', link: '/news_ds-8' }
  },
  '8': {
    title: '关于义乌分公司搬迁通告',
    category: '公司新闻',
    author: 'admin',
    date: '2021-05-17',
    views: 145,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px; text-align: center;"><span style="font-size: 18px;"><strong>关于义乌分公司搬迁通告</strong></span></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px; text-align: center;"><img alt="" src="${img_20210517_152601}" style="width: 716px; height: 602px;"></p>`,
    prev: { title: '疯涨十倍！运价一周飙升1500美金，再创历史新高', link: '/news_ds-9' },
    next: { title: '缺箱缺舱加剧！美线海运半月涨价25%', link: '/news_ds-7' }
  },
  '6': {
    title: '母恩比海深',
    category: '公司新闻',
    author: 'admin',
    date: '2021-05-08',
    views: 167,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210508_155820}"></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">把心里的爱，全部打包给你。</p>`,
    prev: { title: '缺箱缺舱加剧！美线海运半月涨价25%', link: '/news_ds-7' },
    next: { title: '提醒：4月24日起，盐田港暂停接收到港船期5天后的出口重箱', link: '/news_ds-5' }
  },
  '7': {
    title: '缺箱缺舱加剧！美线海运半月涨价25%',
    category: '行业动态',
    author: 'admin',
    date: '2021-05-17',
    views: 156,
    content: `<p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">有卖家感慨：半月海运涨价25%，利润又受到了打击。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">近日，空派价格回落，50甚至4X的报价陆续出现，让只能少量补货的卖家松了一口气。但卖家倚仗的海运这个主要渠道，价格却一再上扬。有卖家感慨：半月海运涨价25%，利润又受到了打击。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">缺箱却舱，舱位价格飙升仍一舱难求，甚至催生了一个刷箱黄牛职业。&ldquo;办公室四个人一起在线抢一个鹿特丹舱位，秒没，难度堪比抢五一火车票。&rdquo;一位货代表示。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">但海运涨价局势或将持续。目前，全球近8成海运航线运价指数上涨，赫伯罗特、达飞上调综合费率上涨附加费，有货代分析，最快要等明年第二季度，海运费才会平稳下降。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>半月海运涨价25%，卖家直呼&ldquo;太贵了&rdquo;</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">结合近日行业情况，有亚马逊卖家意识到，今年保持高额增长很难，能稳住利润和利润率就不错了，其中一个因素就是海运费疯涨。一位卖家吐槽：&ldquo;利润率遭受半月海运涨价25%和汇率的双重打击。&rdquo;&nbsp;</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">&nbsp;以美森为例，卖家收到的海运报价涨了多少？这位货代分析，现在美西普船宁波到洛杉矶集装箱价格是9000美金，仅到港。而去年10月份，送至洛杉矶PHX5、ONT9、PHX7仓库的不打托价格为五六千美金，打托价格也只有七八千美金。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">海运价格为什么涨那么多？主要原因仍然是集装箱短缺、船只舱位紧张，但多位货代指出，以美森为例，市场上价格那么贵，都是倒卖舱位倒出来的。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>缺箱却舱加剧，4个人都抢不到1个舱位</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">央视财经报道，数据显示，在全球21条海运航线中，有16条海运航线运价指数上涨，只有5条海运航线运价指数下跌。&ldquo;海上丝绸之路&rdquo;沿线地区主要港口中，12个港口运价指数上涨。业内人士分析，今年9月以前，集装箱海运价格很难下降。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">赫伯罗特宣布，自6月1日起，对东亚地区至美国和加拿大的东行航线，上调综合费率上涨附加费（GRI）。收费标准为，所有20英尺集装箱，每箱收取960美元；所有40英尺集装箱，每箱收取1200美元。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">达飞6月1日起上调亚洲港口至美国、加拿大航线的GRI，最高上调1600美元/箱。MSC自6月1日起上调亚洲-美国航线的GRI及燃油附加费。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">有货代预测，最快要等明年第二季度，海运费才会平稳下降。不少跨境卖家十分无奈，今年的节奏被完全打乱。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">海运价格持续上涨的时候，空派价格有所回调。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>空派价格下降，有货代报价4开头</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">本周空排和快递价格有所回调，有货代报价5开头，称美国和加拿大空派同时促销。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">针对这一波空派降价，有货代告知客户，价格只是短暂回调，尽快安排补货，下周又是进入大涨价模式，排航班时效延误等问题也随之而来。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">空派之外，快递的价格也有回落，一位货代报价，快递的价格已经跌到5开头了。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">敦煌网发布公告：部分快递渠道发美国路向已出现排仓。公告称，接到仓库通知，部分快递渠道发美国路向已出现一定的排仓情况，请卖家提前与收件人做好解释工作。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">空派和快递接下来的走势不好说，不过目前美国末端的情况不容乐观。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><strong>美国汽油短缺，末端派送或受影响</strong></p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;">美国大型燃油运输管道运营商科洛尼尔管道运输公司日前遭到勒索软件攻击，被迫关闭旗下成品油管道干线。全面重启的时间目前尚不确定。</p>
    <p style="font-family: 微软雅黑, Verdana, Arial; font-size: 14px;"><img alt="" src="${img_20210517_150640}" style="width: 465px; height: 201px;"></p>`,
    prev: { title: '关于义乌分公司搬迁通告', link: '/news_ds-8' },
    next: { title: '母恩比海深', link: '/news_ds-6' }
  },
  '5': {
    title: '提醒：4月24日起，盐田港暂停接收到港船期5天后的出口重箱',
    category: '行业动态',
    author: 'admin',
    date: '2021-04-24',
    views: 134,
    content: `<p><strong>盐田港五一假期操作安排</strong></p>
    <p><strong><span style="color: rgb(0, 0, 0);">"五一"黄金周迎来出货高峰，码头操作渐趋繁忙。盐田国际已全力以赴处理高峰作业需求。</span></strong></p>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;">&nbsp;</section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;"><strong><span style="margin: 0px; padding: 0px; max-width: 100%; box-sizing: border-box !important; overflow-wrap: break-word !important;"><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">为确保港外交通顺畅，避免出现交通拥堵，盐田国际码头将于</span><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(255, 76, 65); box-sizing: border-box !important; overflow-wrap: break-word !important;">4月24日00时起暂停接收到港船期5天后的出口重箱服务</span><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">。具体安排如下：</span></span></strong></section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;">&nbsp;</section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;"><strong><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">1、4月24日暂停接收到港船期4月29日后的重柜；</span></strong></section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;"><strong><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">2、4月25日暂停接收到港船期4月30日后的重柜。</span></strong></section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;"><strong><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">以此类推，安排直至5月8日00时。</span></strong></section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;">&nbsp;</section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; min-height: 1em; line-height: 2em; box-sizing: border-box !important; overflow-wrap: break-word !important;"><strong><span style="margin: 0px; padding: 0px; max-width: 100%; color: rgb(0, 0, 0); box-sizing: border-box !important; overflow-wrap: break-word !important;">节前进港车多，请各位司机有序排队进港，并听从现场交警指挥。</span></strong></section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; box-sizing: border-box !important; overflow-wrap: break-word !important;"><br>&nbsp;</section>
    <section style="margin: 0px; padding: 0px; max-width: 100%; text-align: center; letter-spacing: 0.816px; box-sizing: border-box !important; overflow-wrap: break-word !important;">
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; text-indent: 0em; min-height: 1em; letter-spacing: 0.544px; color: rgb(97, 97, 97); widows: 1; text-align: left; font-family: -apple-system-font, BlinkMacSystemFont, Arial, sans-serif; box-sizing: border-box !important; overflow-wrap: break-word !important;">&nbsp;</section>
    <section style="margin: 0px 8px; padding: 0px; max-width: 100%; text-indent: 0em; min-height: 1em; letter-spacing: 0.544px; color: rgb(97, 97, 97); widows: 1; text-align: left; font-family: -apple-system-font, BlinkMacSystemFont, Arial, sans-serif; box-sizing: border-box !important; overflow-wrap: break-word !important;">&nbsp;</section>
    </section>`,
    prev: { title: '母恩比海深', link: '/news_ds-6' },
    next: null
  }
}

// 使用 computed 从硬编码数据获取新闻
const newsData = computed(() => {
  const id = route.params.id
  return newsDatabase[id] || {
    title: '新闻不存在',
    date: '',
    views: 0,
    content: '<p>抱歉，您访问的新闻不存在。</p>',
    prev: null,
    next: null
  }
})

// 根据新闻分类计算返回链接
const backLink = computed(() => {
  if (newsData.value.category === '公司新闻') {
    return '/news-1'
  } else if (newsData.value.category === '行业动态') {
    return '/news-2'
  }
  return '/news'
})

// 根据新闻分类计算分类名称
const categoryName = computed(() => {
  return newsData.value.category || '新闻中心'
})

// 根据新闻分类计算分类链接
const categoryLink = computed(() => {
  if (newsData.value.category === '公司新闻') {
    return '/news-1'
  } else if (newsData.value.category === '行业动态') {
    return '/news-2'
  }
  return '/news'
})
</script>
