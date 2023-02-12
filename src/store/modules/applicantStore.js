import { loggerService } from '@/services/loggerService'
import { msgService } from '@/services/msgService'
import { applicantService } from '@/services/applicantService'
import { activityMap } from '@/services/activityService'

export const applicant = {
  namespaced: true,

  state: {
    job: null,
    applicant: null,
    isFetching: false,
    interviewErr: null,
    fileRetryMap: {},
    waitForNetwork: false,
    isUploadDone: false,
    isInvitationPage: true,
    isPreview: false,
  },

  getters: {
    job(state) {
      return state.job
    },

    applicant(state) {
      return state.applicant
    },

    interviewErr(state) {
      return state.interviewErr
    },

    isFetching(state) {
      return state.isFetching
    },

    fileRetryMap(state) {
      return state.fileRetryMap
    },

    waitForNetwork(state) {
      return state.waitForNetwork
    },

    isUploadDone(state) {
      return state.isUploadDone
    },

    isInvitationPage(state) {
      return state.isInvitationPage
    },

    isPreview(state) {
      return state.isPreview
    },
  },

  mutations: {
    setJob(state, { job }) {
      state.job = job
    },

    setApplicant(state, { applicant }) {
      state.applicant = applicant
    },

    setInterviewErr(state, err) {
      state.interviewErr = err
    },

    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },

    addFileRetry(state, { fileId }) {
      const retryCount = state.fileRetryMap[fileId]
      state.fileRetryMap = {
        ...state.fileRetryMap,
        [fileId]: retryCount ? retryCount + 1 : 1,
      }
    },

    setWaitForNetwork(state, { waitForNetwork }) {
      state.waitForNetwork = waitForNetwork
    },

    setIsUploadDone(state, { isUploadDone }) {
      state.isUploadDone = isUploadDone
    },

    setIsInvitationPage(state, { isInvitationPage }) {
      state.isInvitationPage = isInvitationPage
    },

    setIsPreview(state, { isPreview }) {
      state.isPreview = isPreview
    },
  },

  actions: {
    async loadJob({ commit, state }, { jobId }) {
      try {
        if (!state.job) commit('setIsFetching', true)
        const job = await applicantService.getJobById(jobId)
        commit('setJob', { job })
      } catch (err) {
        // commit('setInterviewErr', err)
        loggerService.error('[applicantStore] [loadJob] Failed to load job', jobId, err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async loadApplicant({ commit }, { applicantId }) {
      commit('setIsFetching', true)
      try {
        const applicant = applicantId
          ? await applicantService.getById(applicantId)
          : applicantService.getDefaultApplicant()

        commit('setApplicant', { applicant })
      } catch (err) {
        // commit('setInterviewErr', err)
        loggerService.error('[applicantStore] [loadApplicant] Failed to load applicant', applicantId, err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async addApplicant({ commit, dispatch, state }, { applicant }) {
      try {
        dispatch(
          'activity/addActivity',
          activityMap.applicant({ type: '', desc: `submitted to job ${state.job.info.title} ` }),
          { root: true },
        )
        const addedApplicant = await applicantService.add(applicant, state.job._id)
        commit('setApplicant', { applicant: addedApplicant })
        return addedApplicant
      } catch (err) {
        loggerService.error(
          '[applicantStore] [addApplicant] Failed to add applicant:',
          applicant.id,
          'for job:',
          state.job._id,
          err,
        )
        commit('app/setAlertData', { alertData: msgService.failUpdate('applicant') }, { root: true })
      }
    },

    async updateApplicant({ commit, dispatch, state }, { applicant }) {
      try {
        dispatch('activity/addActivity', activityMap.applicant({ type: 'update', desc: `of ` }), { root: true })

        commit('setApplicant', { applicant })
        return await applicantService.update(applicant, state.job._id)

      } catch (err) {
        loggerService.error(
          '[applicantStore] [updateApplicant] Failed to update applicant:',
          applicant.id,
          'for job:',
          state.job._id,
          err,
        )
        commit('app/setAlertData', { alertData: msgService.failUpdate('applicant') }, { root: true })
      }
    },
  },
}
