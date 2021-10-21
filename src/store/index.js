import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    adminIsLogin: false,
    editCardModel: {
      model: false,
      validation: null,
      loading: false,
      avatarIndex: 0,
      idEmploye: '',
      name: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      address: "",
      yearBirth: null,
      role: "",
    },
    userInformations: {
      name: "",
      lastname: "",
      email: "",
      token: "",
    },
    alert: {
      model: false,
      text: "",
      type: "info",
    },
    cardInactive: {},
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
    },
    SET_ALERT_MODEL(state, payload) {
      state.alert.model = !!payload;
    },
    SET_ALERT_TEXT(state, payload) {
      state.alert.text = payload;
    },
    SET_ALERT_TYPE(state, payload) {
      state.alert.type = payload;
    },
    SET_EDIT_CARD(state, payload) {
      state.editCardModel = payload;
    },
    SET_CARD_INACTIVE(state, payload) {
      state.cardInactive = payload;
    },
  },
  actions: {
    setUserInformations(context, payload) {
      context.commit("SET_USER_NAME", payload.name);
      context.commit("SET_USER_LASTNAME", payload.lastname);
      context.commit("SET_USER_EMAIL", payload.email);
      context.commit("SET_USER_TOKEN", payload.login + " " + payload.token);
      context.commit("SET_USER_LOGIN_STATUS", payload.status);
    },
    setUserLoginStatus(context, payload) {
      context.commit("SET_USER_LOGIN_STATUS", payload);
    },
    clearUserInformations(context) {
      context.commit("SET_USER_NAME", "");
      context.commit("SET_USER_LASTNAME", "");
      context.commit("SET_USER_EMAIL", "");
      context.commit("SET_USER_TOKEN", "");
      context.commit("SET_USER_LOGIN_STATUS", false);
    },
    setAlert(context, payload) {
      context.commit("SET_ALERT_MODEL", payload.model);
      context.commit("SET_ALERT_TEXT", payload.text);
      context.commit("SET_ALERT_TYPE", payload.type);
    },
    setEditCardModel(context, payload) {
      context.commit("SET_EDIT_CARD", payload);
    },
    setCardInactive(context, payload) {
      context.commit("SET_CARD_INACTIVE", payload);
    }
  },
  modules: {},
});
