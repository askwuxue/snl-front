import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录成功后保存用户信息
    user: JSON.parse(window.localStorage.getItem('user')) || null
  },
  // 处理state的同步请求并处理state
  mutations: {
    setUser (state, payload) {
      state.user = payload
      // 登录信息持久化处理
      window.localStorage.setItem('user', payload)
    }
  },
  // 接收异步请求，调用mutations
  actions: {},
  modules: {}
})
