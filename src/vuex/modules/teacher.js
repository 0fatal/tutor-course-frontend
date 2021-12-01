const store = {
  state: () => ({
    teacherInfo: JSON.parse(localStorage.getItem('teacherInfo')) || {
      staffId: '',
      name: ''
    }
  }),

  mutations: {
    saveTeacherInfo (state, teacherInfo) {
      state.teacherInfo = teacherInfo
      localStorage.setItem('teacherInfo', JSON.stringify(teacherInfo))
    }
  },

  actions: {
    saveTeacherInfo ({commit}, teacherInfo) {
      commit('saveTeacherInfo', teacherInfo)
    }
  },

  getters: {
    teacherInfo: state => state.teacherInfo
  }
}
export default store
