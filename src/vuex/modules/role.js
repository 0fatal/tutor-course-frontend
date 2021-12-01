import store from '../index'
import router from '../../router/index'
export default {
  state: {
    info: JSON.parse(localStorage.getItem('info')) || '' // 每次刷新都要通过token请求个人信息来筛选动态路由
  },
  mutations: {
    setInfo: async (state, info) => {
      state.info = info
      localStorage.setItem('info', JSON.stringify(store.getters.info))
      await store.dispatch('newRoutes', store.getters.info.role)
      let newAddRouters = store.getters.addRouters
      await router.addRoutes(newAddRouters)
    },
    getInfo: async (state) => {
      let info = JSON.parse(localStorage.getItem('info'))
      if (info) {
        await store.dispatch('newRoutes', store.getters.info.role)
        let newAddRouters = store.getters.addRouters
        await router.addRoutes(newAddRouters)
      }
    },
    setRole (state, options) { // 切换角色，测试权限管理
      state.info = {
        role: options.role,
        permissions: options.permissions || ''
      }
      localStorage.setItem('info', JSON.stringify(store.getters.info))
      store.dispatch('newRoutes', options.role)
      router.addRoutes(store.getters.addRouters)
    }
  },
  actions: {
    setInfo ({commit}, token) {
      commit('setInfo', token)
    },
    getInfo ({commit}, token) {
      commit('getInfo', token)
    },
    setRole ({commit}, options) {
      // 权限测试
      commit('setRole', options)
    }
  }
}
