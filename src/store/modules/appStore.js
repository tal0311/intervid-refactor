import axios from 'axios'
import {utilService} from '@/services/utilService'
import {setLang} from '@/services/i18nService'
import {detect} from 'detect-browser'
// console.log(import.meta.env.MODE)
export const app = {
  namespaced: true,

  state: {
    modal: {
      type: '',
      data: null,
      isDarkScreen: false,
    },
    alertData: null,
    isMobile: utilService.isMobile(),
    isMobileDevice: utilService.isMobileDevice(),
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

    progressBar(state) {
      return state.progressBar
    },

    isMobile(state) {
      return state.isMobile
    },

    isMobileDevice(state) {
      return state.isMobileDevice
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

    setCancelRequest(state, {cancel, key}) {
      state.cancelRequestMap[key] = cancel
    },

    setAlertData(state, {alertData}) {
      state.alertData = alertData
    },

    setProgressBar(state, progressBar) {
      state.progressBar = progressBar
    },

    setIsMobile(state, {isMobile}) {
      state.isMobile = isMobile
    },

    setLang(state, {lang}) {
      state.lang = lang
      setLang(lang)
    },
  },

  actions: {
    handleCancelRequest({commit, dispatch}, key) {
      const source = axios.CancelToken.source()
      dispatch('cancelRequest', key)
      commit('setCancelRequest', {cancel: source.cancel, key})
      return source.token
    },
    cancelRequest({state}, key) {
      if (!state.cancelRequestMap[key]) return
      state.cancelRequestMap[key](`Request ${key} Cancelled`)
    },

    toggleModal({commit, state}, modal) {
      const modalType = state.modal.type ? '' : modal?.type
      const modalData = state.modal.type ? null : modal?.data
      const isDarkScreen = state.modal.isDarkScreen ? false : modal?.isDarkScreen
      commit('setModal', {type: modalType, data: modalData, isDarkScreen})
    },

    setLang({commit}, {lang}) {
      commit('setLang', {lang})
      const elBody = document.querySelector('body')
      elBody.classList.remove('he')
      if (lang === 'he') elBody.classList.add('he')
      localStorage.setItem('userLang', lang)
    },
  },
}
