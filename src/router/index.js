import Vue from 'vue'
import VueRouter from 'vue-router'

// 必须使用这种方式注册VueRouter
Vue.use(VueRouter)

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
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: "menu" */'@/views/menu/index')
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
  }
]

const router = new VueRouter({
  routes
})

export default router
