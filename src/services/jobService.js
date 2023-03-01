// import store from '@/store'
import httpService from './httpService'
import {utilService} from './utilService'
import {companyService} from './companyService'
import {templateService} from './templateService'
import {userService} from '@/services/userService'
import {defaultImgUrl} from '@/services/constData'


export const jobService = {
  query,
  getById,
  add,
  update,
  remove,
  updateApplicants,
  removeApplicants,
  getApplicantVideos,
  getEmptyJob,
  getApplicants,
  getJobWithApplicant,
  getExpectedApplicantCount,
  getExpectedJobCount,
  // updateApplicants,
}

const ROUTE = 'job'

function query(filterBy, sort, cancelToken) {
  // const key = 'job/query'
  // const token = _handleCancelRequest(key)

  const urlParams = utilService.getUrlParamsFromObj({...filterBy, ...sort})
  const url = ROUTE + urlParams
  return httpService.customRequest('get', url, null, {cancelToken})
}

function getApplicants(filterBy, sort, cancelToken) {
  // const key = 'job/getApplicants'
  // const token = _handleCancelRequest(key)

  const urlParams = utilService.getUrlParamsFromObj({...filterBy, ...sort})
  const url = ROUTE + '/applicant' + urlParams
  return httpService.customRequest('get', url, null, {cancelToken})
}

function getById(jobId) {
  return httpService.get(`${ROUTE}/${jobId}`)
}

function add(job) {
  return httpService.post(ROUTE, {job})
}

function update(jobs) {
  // job = cloneDeep(job)
  // delete job.applicants
  jobs = jobs.map((job) => {
    delete job.applicants
    return job
  })
  return httpService.put(`${ROUTE}`, {jobs})
}

function remove(jobId) {
  return httpService.delete(`${ROUTE}/${jobId}`)
}

function updateApplicants(applicants) {
  return httpService.put(`${ROUTE}/applicant`, {applicants})
}

function removeApplicants(applicants) {
  return httpService.put(`${ROUTE}/applicantDelete`, {applicants})
}

function getApplicantVideos(applicantId, jobId, cancelToken) {
  // const key = 'job/getApplicantVideos'
  // const token = _handleCancelRequest(key)
  // return httpService.get(`${ROUTE}/applicantVideos/${applicantId}/${jobId}`)
  const url = `${ROUTE}/applicantVideos/${applicantId}/${jobId}`
  return httpService.customRequest('get', url, null, {cancelToken})
}
function getJobWithApplicant(jobId, applicantId) {
  return httpService.get(`${ROUTE}/${jobId}/${applicantId}`)
}

function getExpectedApplicantCount(filterBy, cancelToken) {
  // const key = 'job/getExpectedApplicantCount'
  // const token = _handleCancelRequest(key)

  const urlParams = utilService.getUrlParamsFromObj({...filterBy})
  return httpService.customRequest('get', ROUTE + '/applicantCount' + urlParams, null, {cancelToken})
}

function getExpectedJobCount(filterBy, cancelToken) {
  // const key = 'job/getExpectedJobCount'
  // const token = _handleCancelRequest(key)

  const urlParams = utilService.getUrlParamsFromObj({...filterBy})
  return httpService.customRequest('get', ROUTE + '/jobCount' + urlParams, null, {cancelToken})
}

function getEmptyJob(user) {
  return {
    info: {
      coverUrl: defaultImgUrl.jobCover,
      title: '',
      desc: '',
      location: '',
    },
    rule: {
      isOneTry: true,
      isCvRequired: false,
    },
    quests: templateService.getDefaultQuests(),
    applicants: [],
    owner: userService.getMiniUser(user),
    company: companyService.getMiniCompany(user) || '',
    archivedAt: null,
  }
}
