import {loggerService} from '@/services/loggerService'
import {recordService} from '@/services/recordService.js'

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
    setRecords(state, {records}) {
      state.records = records
    },
    settotalRecordCount(state, {totalRecordCount}) {
      state.totalRecordCount = totalRecordCount
    },
    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },
    setSelectedRecordId(state, {recordId}) {
      state.selectedRecordId = recordId
    },
  },

  actions: {
    async loadRecords({commit, dispatch}, {filterBy, sort}) {
      commit('setIsFetching', true)
      try {
        // #HANDLE CANCEL
        const key = 'record/query'
        const cancelToken = await dispatch('app/handleCancelRequest', key, {root: true})
        const {records, totalRecordCount} = await recordService.query(filterBy, sort, cancelToken)
        commit('settotalRecordCount', {totalRecordCount})
        commit('setRecords', {records})
      } catch (err) {
        loggerService.error('[recordStore] [loadRecords] Failed to load records', err)
      } finally {
        commit('setIsFetching', false)
      }
    },
  },
}
