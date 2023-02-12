import { loggerService } from '@/services/loggerService'
import { recordService } from '@/services/recordService.js'

export const record = {
  namespaced: true,

  state: {
    records: [],
    totalRecordCount: 100,
    isFetching: false,
    selectedRecordId: null,
  },

  getters: {
    records(state) {
      return state.records
    },
    totalRecordCount(state) {
      return state.totalRecordCount
    },
    isFetching(state) {
      return state.isFetching
    },
    selectedRecordId(state) {
      return state.selectedRecordId
    },
  },

  mutations: {
    setRecords(state, { records }) {
      state.records = records
    },
    settotalRecordCount(state, { totalRecordCount }) {
      state.totalRecordCount = totalRecordCount
    },
    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },
    setSelectedRecordId(state, { recordId }) {
      state.selectedRecordId = recordId
    },
  },

  actions: {
    async loadRecords({ commit, state }, { filterBy, sort }) {
      commit('setIsFetching', true)
      try {
        const { records, totalRecordCount } = await recordService.query(filterBy, sort)
        commit('settotalRecordCount', { totalRecordCount })
        commit('setRecords', { records })
      } catch (err) {
        loggerService.error('[recordStore] [loadRecords] Failed to load records', err)
      } finally {
        commit('setIsFetching', false)
      }
    },
  },
}
