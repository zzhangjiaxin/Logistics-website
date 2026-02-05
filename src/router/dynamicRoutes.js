/**
 * 动态路由配置
 * 将导航的 code 映射到对应的 Vue 组件
 *
 * 当管理员在后台修改导航的 URL 时，前端会根据这个映射表自动注册新的路由
 */

// 导入所有可能用到的页面组件
import HomeView from '@/views/HomeView.vue'
import TrackView from '@/views/TrackView.vue'
import AboutView from '@/views/AboutView.vue'
import BusinessView from '@/views/BusinessView.vue'
import BusinessDetailView from '@/views/BusinessDetailView.vue'
import NewsView from '@/views/NewsView.vue'
import NewsCategoryView from '@/views/NewsCategoryView.vue'
import HelpView from '@/views/HelpView.vue'
import ContactView from '@/views/ContactView.vue'

/**
 * 路由映射表
 * key: 导航的 code（后端数据库中的标识符）
 * value: 路由配置对象
 */
export const routeMap = {
  // ========== 父级导航 ==========

  // 查询相关
  'track_query': {
    component: TrackView,
    name: 'Track',
    meta: { title: '物流查询' }
  },

  // 关于我们
  'about': {
    component: AboutView,
    name: 'About',
    meta: { title: '关于我们' }
  },

  // 业务相关
  'business': {
    component: BusinessView,
    name: 'Business',
    meta: { title: '主营渠道' }
  },

  // 新闻中心
  'news': {
    component: NewsView,
    name: 'News',
    meta: { title: '新闻中心' }
  },

  // 帮助中心
  'help': {
    component: HelpView,
    name: 'Help',
    meta: { title: '帮助中心' }
  },

  // 联系我们
  'contact': {
    component: ContactView,
    name: 'Contact',
    meta: { title: '联系我们' }
  },

  // ========== 子菜单 ==========

  // 物流查询 - 子菜单（共享父级组件 TrackView）
  'track_waybill': {
    component: TrackView,
    name: 'TrackWaybill',
    meta: { title: '运单查询' }
  },
  'track_parcel': {
    component: TrackView,
    name: 'TrackParcel',
    meta: { title: '包裹查询' }
  },

  // 关于我们 - 子菜单（共享父级组件 AboutView，通过锚点区分）
  'about_company': {
    component: AboutView,
    name: 'AboutCompany',
    meta: { title: '公司简介' }
  },
  'about_culture': {
    component: AboutView,
    name: 'AboutCulture',
    meta: { title: '企业理念' }
  },
  'about_history': {
    component: AboutView,
    name: 'AboutHistory',
    meta: { title: '发展历程' }
  },
  'about_honor': {
    component: AboutView,
    name: 'AboutHonor',
    meta: { title: '荣誉资质' }
  },

  // 主营渠道 - 子菜单（使用独立组件 BusinessDetailView）
  'business_air': {
    component: BusinessDetailView,
    name: 'BusinessAir',
    meta: { title: '空派专线', type: 1 }
  },
  'business_sea': {
    component: BusinessDetailView,
    name: 'BusinessSea',
    meta: { title: '海派专线', type: 2 }
  },
  'business_land': {
    component: BusinessDetailView,
    name: 'BusinessLand',
    meta: { title: '陆运专线', type: 3 }
  },

  // 新闻中心 - 子菜单（使用独立组件 NewsCategoryView）
  'news_company': {
    component: NewsCategoryView,
    name: 'NewsCompany',
    meta: { title: '公司新闻', category: 1 }
  },
  'news_industry': {
    component: NewsCategoryView,
    name: 'NewsIndustry',
    meta: { title: '行业动态', category: 2 }
  }
}

/**
 * 根据导航配置生成路由配置
 * @param {Array} navigations - 后端返回的导航列表
 * @returns {Array} 路由配置数组
 */
export function generateRoutes(navigations) {
  const routes = []
  const registeredPaths = new Set() // 记录已注册的路径，避免重复

  navigations.forEach(nav => {
    // 处理父级导航（有 code 的导航）
    if (nav.code && routeMap[nav.code]) {
      const routeConfig = routeMap[nav.code]
      const basePath = nav.url.split('?')[0] // 去掉查询参数，获取基础路径

      // 只注册一次基础路径
      if (!registeredPaths.has(basePath)) {
        routes.push({
          path: basePath,
          name: routeConfig.name,
          component: routeConfig.component,
          meta: {
            ...routeConfig.meta,
            navigationId: nav.id,
            navigationCode: nav.code
          }
        })

        registeredPaths.add(basePath)
        console.log(`[动态路由] 注册父级路由: ${basePath} -> ${routeConfig.name}`)
      }
    }

    // 处理子菜单
    if (nav.children && nav.children.length > 0) {
      nav.children.forEach(child => {
        // 如果子菜单有自己的 code，按照父级导航的方式处理
        if (child.code && routeMap[child.code]) {
          const childRouteConfig = routeMap[child.code]
          const childBasePath = child.url.split('?')[0]

          if (!registeredPaths.has(childBasePath)) {
            routes.push({
              path: childBasePath,
              name: childRouteConfig.name,
              component: childRouteConfig.component,
              meta: {
                ...childRouteConfig.meta,
                navigationId: child.id,
                navigationCode: child.code
              }
            })

            registeredPaths.add(childBasePath)
            console.log(`[动态路由] 注册子菜单路由: ${childBasePath} -> ${childRouteConfig.name}`)
          }
        }
        // 如果子菜单没有 code，但父级有 code，则子菜单共享父级的组件
        else if (nav.code && routeMap[nav.code]) {
          const parentRouteConfig = routeMap[nav.code]
          const childBasePath = child.url.split('?')[0]

          // 只有当子菜单的基础路径与父级不同时，才注册新路由
          // 如果相同（如 /track 和 /track?type=parcel），则共享同一个路由
          if (!registeredPaths.has(childBasePath)) {
            routes.push({
              path: childBasePath,
              name: `${parentRouteConfig.name}_${child.id}`, // 使用唯一的名称
              component: parentRouteConfig.component,
              meta: {
                ...parentRouteConfig.meta,
                navigationId: child.id,
                parentNavigationId: nav.id,
                isChildRoute: true
              }
            })

            registeredPaths.add(childBasePath)
            console.log(`[动态路由] 注册子菜单路由（共享父级组件）: ${childBasePath} -> ${parentRouteConfig.name}`)
          }
        }
      })
    }
  })

  return routes
}
