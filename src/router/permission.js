import NProgress from 'nprogress'

import router from './index'
// import store from '../vuex'

//  获取角色信息，根据用户权限动态加载路由
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})


// //  真实使用 参照全栈项目 https://github.com/Nirongxu/nodePlatform-eggjs
// import router from "./index"
// import store from "../vuex"
// import fetchUser from "@/api/apis/user"
//
// router.beforeEach((to, from, next) => {
//   if (store.getters.token && store.getters.token !== "undefined") {
//     // store.dispatch('setToken', store.getters.token)
//     if (to.path === "/login") {
//       next({path: "/"})
//     } else {
//       if (!store.getters.info) {
//         (async function getAddRouters () {
//           fetchUser.fetchGetUserInfo().then(async function (response) {
//             await store.dispatch("getInfo", response.data)
//             await store.dispatch("newRoutes", store.getters.info.authorityRouter)
//             await router.addRoutes(store.getters.addRouters)
//             next({path: "/index"})
//           }).catch(function (error) {
//             console.log(error)
//           })
//         }())
//       } else {
//         let is404 = to.matched.some(record => {
//           console.log(record)
//           if (record.meta.role) {
//             return store.getters.info.authorityRouter === -1
//           }
//         })
//         if (is404) {
//           next({path: "/404"})
//           return false
//         }
//         next()
//       }
//     }
//   } else {
//     if (to.path === "/login") {
//       next()
//     }
//     next({path: "/login"})
//   }
// })
