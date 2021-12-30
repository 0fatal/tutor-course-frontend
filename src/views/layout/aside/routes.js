import store from '../../../vuex/'

const baseRoutes = [
  {
    name: '课程相关',
    type: 'course',
    children: [
      {
        name: '课程列表',
        route: '/course'
      },
      {
        name: '模板列表',
        route: '/course/template'
      },
      {
        name: '实例列表',
        route: '/course/template/instance'
      },
      {
        name: '成绩相关',
        type: 'excel',
        children: [
          {
            name: '成绩册',
            route: '/excel/template/instance'
          },
          {
            name: '成绩册模板',
            route: '/excel/template'
          }
        ]
      }
    ]
  },
  {
    name: '教师信息',
    type: 'teacher',
    children: [
      {
        route: '/info/teacher',
        name: '教师个人信息'
      }
    ]
  }
]

const moreRoutes = [
  {
    name: '管理员模块',
    type: 'management',
    children: [
      {
        name: '用户管理',
        route: '/management/user'
      },
      {
        name: '课程模板管理',
        route: '/management/course/template'
      }
    ]
  }
]

const routes = store.getters.teacherInfo.isAdmin === 1 ? [...baseRoutes, ...moreRoutes] : baseRoutes

export default routes
