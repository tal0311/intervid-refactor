import axios from 'axios'
import { utilService } from '@/services/utilService'
import { setLang } from '@/services/i18nService'
import { detect } from 'detect-browser'
export const app = {
  namespaced: true,

  state: {
    modal: {
      type: 'UserFeedback',
      data: null,
      isDarkScreen: false,
    },
    alertData: null,
    actionsData: null,
    isMobile: utilService.isMobile(),
    isMobileDevice: utilService.isMobileDevice(),
    isMobileScreen: utilService.isMobileScreen(),
    browser: detect(),
    progressBar: {
      isShown: false,
      steps: [],
      currStepIdx: null,
    },
    lang: localStorage.getItem('userLang') || 'en',
    cancelRequestMap: {},
  },

  getters: {
    modal(state) {
      return state.modal
    },

    cancelRequestMap(state) {
      return state.cancelRequestMap
    },

    alertData(state) {
      return state.alertData
    },
    actionsData(state) {
      return state.actionsData
    },

    progressBar(state) {
      return state.progressBar
    },

    isMobile(state) {
      return state.isMobile
    },

    isMobileDevice(state) {
      return state.isMobileDevice
    },

    isMobileScreen(state) {
      return state.isMobileScreen
    },

    browser(state) {
      return state.browser
    },

    lang(state) {
      return state.lang
    },
  },

  mutations: {
    setModal(state, modal) {
      state.modal = modal
    },

    setCancelRequest(state, { cancel, key }) {
      state.cancelRequestMap[key] = cancel
    },

    setAlertData(state, { alertData }) {
      state.alertData = alertData
    },
    setActionsData(state, { actionsData }) {
      state.actionsData = actionsData
    },

    setProgressBar(state, progressBar) {
      state.progressBar = progressBar
    },

    setIsMobile(state, { isMobile, isMobileScreen }) {
      state.isMobileScreen = isMobileScreen
      state.isMobile = isMobile
    },

    setLang(state, { lang }) {
      state.lang = lang
      setLang(lang)
    },
  },

  actions: {
    handleCancelRequest({ commit, dispatch }, key) {
      const source = axios.CancelToken.source()
      dispatch('cancelRequest', key)
      commit('setCancelRequest', { cancel: source.cancel, key })
      return source.token
    },
    cancelRequest({ state }, key) {
      if (!state.cancelRequestMap[key]) return
      state.cancelRequestMap[key](`Request ${key} Cancelled`)
    },

    toggleModal({ commit, state }, modal) {
      const modalType = state.modal.type ? '' : modal?.type
      const modalData = state.modal.type ? null : modal?.data
      const isDarkScreen = state.modal.isDarkScreen ? false : modal?.isDarkScreen
      commit('setModal', { type: modalType, data: modalData, isDarkScreen })
      console.log('state.modal:', state.modal)
    },

    setLang({ commit }, { lang }) {
      commit('setLang', { lang })
      const elBody = document.querySelector('body')
      elBody.classList.remove('he')
      if (lang === 'he') elBody.classList.add('he')
      localStorage.setItem('userLang', lang)
    },
  },
}
