import en from '../i18n/lang/en'
import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index'
import Layout from '@/views/layout/layout'
import HomeMain from '@/views/index/mainIndex'

const NotFound = () => import('@/views/page404')

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)
let routeName = en.routeName
let defaultRouter = [
  {
    path: '/',
    redirect: '/index',
    hidden: true,
    children: []
  },
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true,
    children: []
  },
  {
    path: '/index',
    iconCls: 'fa fa-dashboard', // 图标样式class
    name: routeName.home,
    component: Layout,
    alone: true,
    children: [
      {
        path: '/index',
        iconCls: 'fa fa-dashboard', // 图标样式class
        name: '主页',
        component: HomeMain,
        children: []
      }
    ]
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true,
    children: []
  }
]

let addRouter = [
  // {
  //   path: '/',
  //   iconCls: 'fa fa-universal-access', // 图标样式class
  //   name: routeName.permissions,
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/pagePermissions',
  //       iconCls: 'fa fa-expeditedssl', // 图标样式class
  //       name: routeName.pageControl,
  //       component: pagePermissions,
  //       children: []
  //     },
  //     {
  //       path: '/btnPermissions',
  //       iconCls: 'fa fa-toggle-on', // 图标样式class
  //       name: routeName.btnControl,
  //       component: btnPermissions,
  //       children: []
  //     }
  //   ]
  // },
  {
    path: '/',
    iconCls: 'fa fa-universal-access',
    name: routeName.courseManage,
    component: Layout,
    meta: {role: ['teacher', 'student']},
    children: [
      {
        path: '/courseManage/docxInfo',
        iconCls: 'fa fa-toggle-on',
        name: routeName.docxInfo,
        component: () => import('@/views/courseManage/docxInfo'),
        meta: {
          role: ['teacher'],
        },
        children: []
      },
      {
        // path: '/courseManage/createDocx',
        path: '/courseManage/createDocx',
        iconCls: 'fa fa-toggle-on',
        name: routeName.createDocx,
        component: () => import('@/views/courseManage/createDocx'),
        meta: {role: ['teacher']},
        children: []
      },
      {
        path: '/courseManage/information',
        iconCls: 'fa fa-toggle-on',
        name: routeName.courseInfo,
        component: () => import('@/views/courseManage/courseInfo'),
        meta: {role: ['teacher']},
        children: []
      },
      {
        path: '/courseManage/courseApply',
        iconCls: 'fa fa-toggle-on',
        name: routeName.courseApply,
        component: () => import('@/views/courseManage/courseApply'),
        meta: {role: ['student']},
        children: []
      }
    ]
  },
  {
    path: '/',
    iconCls: 'fa fa-universal-access',
    name: routeName.infoManage,
    component: Layout,
    meta: {role: ['teacher', 'student']},
    children: [
      {
        path: '/infoManage/teacherInfo',
        iconCls: 'fa fa-toggle-on',
        name: routeName.teacherInfo,
        component: () => import('@/views/infoManage/teacherInfo'),
        meta: {role: ['teacher']},
        children: []
      },
      {
        path: '/infoManage/studentInfo',
        iconCls: 'fa fa-toggle-on',
        name: routeName.studentInfo,
        component: () => import('@/views/infoManage/studentInfo'),
        meta: {role: ['student']},
        children: []
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    children: []
  }

]
export default new Router({
  routes: defaultRouter
})
export {defaultRouter, addRouter}
