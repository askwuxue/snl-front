import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 必须使用这种方式注册VueRouter
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    // 使用动态加载组件的方式将代码按照组件分割为小文件，只有对应路由才获取相应组件代码
    // 使用魔术注释，对每个打包文件进行命名，便于调试
    component: () => import(/* webpackChunkName: "login" */'@/views/login/index')
  },
  {
    path: '/',
    meta: {
      // 需要认证，如果一级路由设置meta中requireAuth为true，二级路由依旧遵守规则
      requireAuth: true
    },
    component: () => import(/* webpackChunkName: "layout" */'@/views/layout/index'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */'@/views/home/index')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */'@/views/role/index')
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: "advert" */'@/views/advert/index')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: "advert-space" */'@/views/advert-space/index')
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: "course" */'@/views/course/index')
      },
      // 添加课程
      {
        path: '/course/create',
        name: 'course-crate',
        component: () => import(/* webpackChunkName: "course-create" */'@/views/course/create')
      },
      // 编辑课程
      {
        path: '/course/edit/:courseId',
        name: 'course-edit',
        props: true,
        component: () => import(/* webpackChunkName: "course-edit" */'@/views/course/edit')
      },
      // 课程管理
      {
        path: '/course/section/:courseId',
        name: 'course-section',
        props: true,
        component: () => import(/* webpackChunkName: "course-section" */'@/views/course/section')
      },
      // 课程视频
      {
        path: '/course/course-video/:courseId',
        name: 'course-video',
        props: true,
        component: () => import(/* webpackChunkName: "course-course-video" */'@/views/course/courseVideo')
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu" */'@/views/menu/index')
      },
      // 创建菜单
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: "menu-create" */'@/views/menu/create')
      },
      // 编辑菜单
      {
        path: '/menu/edit/:id',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: "menu-edit" */'@/views/menu/edit')
      },
      // 分配菜单路由组件
      {
        path: '/role/alloc-menu/:roleId',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: "alloc-menu" */'@/views/role/allocMenu'),
        // TODO 允许使用props的方式传递路由参数
        props: true
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: "resource" */'@/views/resource/index')
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */'@/views/user/index')
      }
    ]
  },
  {
    path: '*',
    name: '404_notfound',
    component: () => import('@/views/error-page/index')
  }
]

const router = new VueRouter({
  routes
})

// 前置路由守卫功能
router.beforeEach((to, from, next) => {
  // console.log('to: ', to)
  // to路由是否需要身份验证
  if (to.matched.some(record => record.meta.requireAuth)) {
    // 本地是否持久化了用户信息
    // TODO 当本地没有持久化用户信息时，用户信息还有可能保存在Vuex中，所以验证依旧会通过
    if (!store.state.user) {
      return next({
        name: 'login',
        // 上次访问的页面的to路由的fullPath添加给登录页面的redirect，登录成功后拿到redirect进行页面路由跳转
        query: {
          redirect: to.fullPath
        }
      })
    }
    return next()
  } else {
    console.log('不需要认证')
  }
  next()
})

export default router
