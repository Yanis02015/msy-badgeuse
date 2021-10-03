import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    adminIsLogin: false,
    userInformations: {
      name: '',
      lastname: '',
      email: '',
      token: '',
    }
  },
  mutations: {
    SET_USER_NAME(state, payload) {
      state.userInformations.name = payload;
    },
    SET_USER_LASTNAME(state, payload) {
      state.userInformations.lastname = payload;
    },
    SET_USER_EMAIL(state, payload) {
      state.userInformations.email = payload;
    },
    SET_USER_TOKEN(state, payload) {
      state.userInformations.token = payload;
    },
    SET_USER_LOGIN_STATUS(state, payload) {
      state.adminIsLogin = payload;
    }
  },
  actions: {
    setUserInformations(context, payload) {
      context.commit('SET_USER_NAME', payload.name)
      context.commit('SET_USER_LASTNAME', payload.lastname)
      context.commit('SET_USER_EMAIL', payload.email)
      context.commit('SET_USER_TOKEN', payload.token)
    },
    setUserLoginStatus(context, payload) {
      context.commit('SET_USER_LOGIN_STATUS', payload)
    },
    clearUserInformations(context) {
      context.commit('SET_USER_NAME', '')
      context.commit('SET_USER_LASTNAME', '')
      context.commit('SET_USER_EMAIL', '')
      context.commit('SET_USER_TOKEN', '')
      context.commit('SET_USER_LOGIN_STATUS', false)
    }
  },
  modules: {
  }
})
