import {jobService} from '@/services/jobService.js'
import {loggerService} from '@/services/loggerService'
import {mutationHistory} from '../mutationHistory'
import {msgService} from '@/services/msgService'
// import { activityMap } from '@/services/activityService'
import cloneDeep from 'lodash.clonedeep'

export const job = {
  namespaced: true,

  state: {
    jobs: null,
    jobToEdit: null,
    prevJobToEdit: null,
    isFetching: false,
    isSaving: false,
    pageCount: 0,
    totalJobCount: 0,
    filteredJobCount: 0,
    filteredApplicantCount: 0,
    expectedApplicantCount: 0,
    expectedJobCount: 0,
    applicants: null,
    applicantCount: 0,
    applicantPageCount: 0,
    job: null,
    // jobsTitles: null,
    // applicantsTitles: null,
    isFirstChange: true,
    viewType: 'cards',
    jobEditErrors: [],
  },

  getters: {
    jobs(state) {
      return state.jobs
    },

    job(state) {
      return state.job
    },

    jobToEdit(state) {
      return state.jobToEdit
    },

    // jobsTitles(state) {
    //   return state.jobsTitles
    // },

    // applicantsTitles(state) {
    //   return state.applicantsTitles
    // },

    applicants(state) {
      return state.applicants
    },

    pageCount(state) {
      return state.pageCount
    },

    applicantPageCount(state) {
      return state.applicantPageCount
    },

    totalJobCount(state) {
      return state.totalJobCount
    },

    applicantCount(state) {
      return state.applicantCount
    },

    filteredJobCount(state) {
      return state.filteredJobCount
    },
    filteredApplicantCount(state) {
      return state.filteredApplicantCount
    },

    expectedApplicantCount(state) {
      return state.expectedApplicantCount
    },
    expectedJobCount(state) {
      return state.expectedJobCount
    },

    isFetching(state) {
      return state.isFetching
    },

    isSaving(state) {
      return state.isSaving
    },

    isFirstChange(state) {
      return state.isFirstChange
    },

    viewType(state) {
      return state.viewType
    },

    jobEditErrors(state) {
      return state.jobEditErrors
    },
  },

  mutations: {
    setJobsInfo(state, {applicantCount, applicantsTitles, jobsTitles, jobCount}) {
      state.applicantCount = applicantCount
      state.applicantsTitles = applicantsTitles
      state.jobsTitles = jobsTitles
      state.totalJobCount = jobCount
    },

    setExpectedApplicantCount(state, {expectedApplicantCount}) {
      state.expectedApplicantCount = expectedApplicantCount
    },
    setExpectedJobCount(state, {expectedJobCount}) {
      state.expectedJobCount = expectedJobCount
    },

    setJobs(state, {jobs, pageCount, filteredJobCount, totalJobCount}) {
      state.jobs = jobs
      state.pageCount = pageCount
      state.filteredJobCount = filteredJobCount
      state.totalJobCount = totalJobCount
    },

    setJob(state, {job}) {
      state.job = job
    },

    setApplicants(state, {applicants, pageCount, filteredApplicantCount, applicantCount}) {
      state.applicants = applicants
      state.applicantPageCount = pageCount
      state.filteredApplicantCount = filteredApplicantCount
      state.applicantCount = applicantCount
    },

    setCachedApplicants(state, {applicants}) {
      state.applicants = applicants
    },
    setCachedJobs(state, {jobs}) {
      state.jobs = jobs
    },
    setJobToEdit(state, {jobToEdit}) {
      state.prevJobToEdit = state.jobToEdit
      state.jobToEdit = jobToEdit
    },

    addJob(state) {
      // {job}
      // state.jobs.unshift(job) TODO: check if added job is relevant for display and add it accordingly
      state.totalJobCount = state.totalJobCount + 1
      // state.jobsTitles.unshift({
      //   _id: job._id,
      //   info: {
      //     title: job.info.title,
      //   },
      // })
    },

    updateJob(state, {job}) {
      state.jobs = state.jobs.map((_job) => (_job._id !== job._id ? _job : job))
    },

    removeJob(state, {jobId}) {
      state.jobs = state.jobs.filter((job) => job._id !== jobId)
    },

    archiveJobs(state, {jobs}) {
      for (const job of jobs) {
        state.jobs = state.jobs.filter((_job) => _job._id !== job._id)
        state.totalJobCount = state.totalJobCount - 1
      }
    },

    restoreJobs(state, {jobs}) {
      for (const job of jobs) {
        state.jobs = state.jobs.filter((_job) => _job._id !== job._id)
        state.totalJobCount = state.totalJobCount + 1
      }
    },

    addApplicant(state) {
      // {applicant, jobId}
      state.applicantCount = state.applicantCount + 1
      state.filteredApplicantCount = state.filteredApplicantCount + 1
    },

    updateApplicants(state, {applicants}) {
      if (applicants && state.applicants) {
        for (const applicant of applicants) {
          var appIdx = state.applicants.findIndex((app) => app.id === applicant.id)
          state.applicants.splice(appIdx, 1, applicant)
        }
      }
    },
    // state.applicants = state.applicants.map((app) => (app.id === applicant.id ? applicant : app))
    removeApplicants(state, {applicants}) {
      if (applicants && state.applicants) {
        for (const applicant of applicants) {
          state.applicants = state.applicants.filter((_applicant) => _applicant.id !== applicant.id)
        }
      }
    },

    archiveApplicants(state, {applicants}) {
      for (const applicant of applicants) {
        state.applicants = state.applicants.filter((_applicant) => _applicant.id !== applicant.id)
      }
      state.applicantCount = state.applicantCount - applicants.length
      state.filteredApplicantCount = state.filteredApplicantCount - applicants.length
    },

    restoreApplicants(state, {applicants}) {
      for (const applicant of applicants) {
        state.applicants = state.applicants.filter((_applicant) => _applicant.id !== applicant.id)
      }
      state.applicantCount = state.applicantCount - applicants.length
      state.filteredApplicantCount = state.filteredApplicantCount - applicants.length
    },

    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },

    setIsSaving(state, isSaving) {
      state.isSaving = isSaving
    },

    setIsFirstChange(state, isFirstChange) {
      state.isFirstChange = isFirstChange
    },

    setViewType(state, {viewType}) {
      state.viewType = viewType
    },

    setJobEditErrors(state, {jobEditErrors}) {
      state.jobEditErrors = jobEditErrors
    },
  },

  actions: {
    async loadJobs({commit, state}, {filterBy, sort, shouldGather = false}) {
      commit('setIsFetching', true)
      try {
        let {jobs, pageCount, filteredJobCount, totalJobCount} = await jobService.query(filterBy, sort)
        if (!jobs) return

        if (shouldGather) {
          if (jobs.length === 0) return
          jobs = [...state.jobs, ...jobs]
        }
        await commit('setJobs', {
          jobs,
          pageCount,
          filteredJobCount,
          totalJobCount,
        })
      } catch (err) {
        loggerService.error('[JobStore] [loadJobs] Failed to load jobs', err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async loadJob({commit}, {jobId}) {
      try {
        const job = await jobService.getById(jobId)
        commit('setJob', {job})
      } catch (err) {
        loggerService.error('[JobStore] [loadJob] Failed to load job', jobId, err)
      }
    },

    async loadApplicants({commit, state}, {filterBy = {}, sort = {}, shouldGather = false}) {
      commit('setIsFetching', true)
      try {
        const res = await jobService.getApplicants(filterBy, sort)
        if (!res) return
        let {applicants, pageCount, filteredApplicantCount} = res
        if (shouldGather) {
          if (applicants.length === 0) return
          applicants = [...state.applicants, ...applicants]
        }
        commit('setApplicants', {
          applicants,
          filteredApplicantCount,
          pageCount,
        })
      } catch (err) {
        loggerService.error('[JobStore] [loadJobs] Failed to load applicants', err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async loadJobToEdit({commit, rootGetters}, {jobId}) {
      try {
        commit('setIsFetching', true)
        const user = rootGetters['user/loggedInUser']
        const jobToEdit = jobId ? await jobService.getById(jobId, user) : jobService.getEmptyJob(user)
        commit('setJobToEdit', {jobToEdit})
      } catch (err) {
        loggerService.error('[JobStore] [loadJobToEdit] Failed to load job', err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async addJob({commit}, {job}) {
      // { dispatch }
      try {
        const addedJob = await jobService.add(job)
        commit('addJob', {job: addedJob})
        commit('setJobToEdit', {jobToEdit: addedJob})
        // dispatch('activity/addActivity', activityMap.job({ type: 'add', meta: { jobId: addedJob._id } }), {
        // root: true,
        // })
      } catch (err) {
        loggerService.error('[JobStore] [addJob] Failed to add job', err)
        commit('app/setAlertData', {alertData: msgService.failArchive('job')}, {root: true})
      }
    },

    async removeJob({commit}, {jobId}) {
      // { dispatch }
      try {
        await jobService.remove(jobId)
        // dispatch('activity/addActivity', activityMap.job({ type: 'remove', meta: { jobId } }), { root: true })
        commit('app/setAlertData', {alertData: msgService.remove('job')}, {root: true})
        commit('removeJob', {jobId})
      } catch (err) {
        loggerService.error('[jobStore] [removeJob] Failed to remove job', err)
        mutationHistory.undo()
        commit('app/setAlertData', {alertData: msgService.failRemove('job')}, {root: true})
      }
    },

    async updateJob({commit, state}, {job, isUndo = false}) {
      // { dispatch }
      try {
        // commit('updateJob', { job })
        const jobToEdit = isUndo ? state.prevJobToEdit : job
        commit('setIsSaving', true)
        commit('setJobToEdit', {jobToEdit})
        // dispatch('activity/addActivity', activityMap.job({ type: 'update', meta: { jobId: jobToEdit._id } }), {
        // root: true,
        // })
        await jobService.update([jobToEdit])
        commit('setIsSaving', false)
      } catch (err) {
        loggerService.error('[jobStore] [updateJob] Failed to update job', err)
        mutationHistory.undo(2)
        commit('app/setAlertData', {alertData: msgService.failUpdate('job')}, {root: true})
      }
    },

    async toggleArchiveJob({commit, state}, {jobs}) {
      // { dispatch }
      const cachedJobs = state.jobs
      const jobsCopy = cloneDeep(jobs)
      const updatedJobs = jobsCopy.map((job) => {
        job.archivedAt = job.archivedAt ? null : Date.now()
        return job
      })
      const type = updatedJobs[0].archivedAt ? 'archive' : 'restore'
      commit(`${type}Jobs`, {jobs: updatedJobs})
      try {
        await jobService.update(updatedJobs)
        commit(
          'app/setAlertData',
          {
            alertData: msgService.archive('job', !!updatedJobs[0].archivedAt, updatedJobs.length),
          },
          {root: true},
        )
        // dispatch('activity/addActivity', activityMap.job({ type, meta: { jobId: job._id } }), { root: true })
      } catch (err) {
        commit('setCachedJobs', {cachedJobs})
        loggerService.error(`[JobStore] [toggleArchiveJob]`, err)
        commit('app/setAlertData', {alertData: msgService.failArchive('job')}, {root: true})
      }
    },

    async getExpectedApplicantCount({commit}, {filterBy}) {
      try {
        const expectedApplicantCount = await jobService.getExpectedApplicantCount(filterBy)
        if (expectedApplicantCount === undefined) return
        commit('setExpectedApplicantCount', {expectedApplicantCount})
      } catch (err) {
        loggerService.error(`[JobStore] [getExpectedApplicantCount]`, err)
      }
    },
    async getExpectedJobCount({commit}, {filterBy}) {
      try {
        const expectedJobCount = await jobService.getExpectedJobCount(filterBy)
        commit('setExpectedJobCount', {expectedJobCount})
      } catch (err) {
        loggerService.error(`[JobStore] [getExpectedJobCount]`, err)
      }
    },

    async removeApplicants({commit, state}, {applicants}) {
      // { dispatch }
      const cachedApplicants = state.applicants
      commit('removeApplicants', {applicants})
      // if(state.applicants)
      try {
        await jobService.removeApplicants(applicants)
        // dispatch('activity/addActivity', activityMap.applicant({ type: 'remove', meta: { applicants } }), {
        //   root: true,
        // })
        commit('app/setAlertData', {alertData: msgService.remove('applicant', applicants.length)}, {root: true})
      } catch (err) {
        commit('setCachedApplicants', {applicants: cachedApplicants})
        loggerService.error('[jobStore] [removeApplicants] Failed to remove applicant:', err)
        commit('app/setAlertData', {alertData: msgService.failRemove('applicant')}, {root: true})
      }
    },

    async updateApplicants({commit, state}, {applicants}) {
      // { dispatch }
      commit('updateApplicants', {applicants})
      const cachedApplicants = state.applicants
      try {
        await jobService.updateApplicants(applicants)
        // dispatch('activity/addActivity', activityMap.applicant({ type: 'update' }), { root: true })
      } catch (err) {
        commit('setCachedApplicants', {applicants: cachedApplicants})
        loggerService.error('[jobStore] [updateApplicants] Failed to update applicant:', applicants, err)
        commit('app/setAlertData', {alertData: msgService.failUpdate('applicant')}, {root: true})
      }
    },

    async toggleArchiveApplicant({commit, state}, {applicants, isAllSelected}) {
      // { dispatch }
      const cachedApplicants = state.applicants
      const applicantsCopy = cloneDeep(applicants)
      const updatedApplicants = applicantsCopy.map((applicant) => {
        applicant.archivedAt = applicant.archivedAt ? null : Date.now()
        return applicant
      })
      const type = updatedApplicants[0].archivedAt ? 'archive' : 'restore'
      if (isAllSelected) {
        commit('setIsFetching', true)
      }
      commit(`${type}Applicants`, {applicants: updatedApplicants})
      try {
        await jobService.updateApplicants(updatedApplicants)
        // dispatch('activity/addActivity', activityMap.applicant({ type }), { root: true })
        commit(
          'app/setAlertData',
          {
            alertData: msgService.archive('applicant', !!updatedApplicants[0].archivedAt, updatedApplicants.length),
          },
          {root: true},
        )
      } catch (err) {
        loggerService.error('[JobStore] [toggleArchiveApplicant]', err)
        commit('setCachedApplicants', {applicants: cachedApplicants})
        commit('app/setAlertData', {alertData: msgService.failArchive('applicant')}, {root: true})
      } finally {
        // commit('setIsFetching', false)
      }
    },

    async loadJobWithApplicant({commit}, {jobId, applicantId}) {
      // { dispatch }
      commit('setIsFetching', true)
      try {
        const job = await jobService.getJobWithApplicant(jobId, applicantId)
        commit('setJob', {job: job})
        // dispatch(
        //   'activity/addActivity',
        //   activityMap.job({ type: 'loadJobWithApplicant', meta: { jobId, applicantId } }),
        //   {
        //     root: true,
        //   },
        // )
      } catch (err) {
        loggerService.error('[JobStore] [loadJobWithApplicant] Failed to add job', err)
        commit('app/setAlertData', {alertData: msgService.failArchive('job')}, {root: true})
      } finally {
        commit('setIsFetching', false)
      }
    },
  },
}
