import { userService } from '@/services/userService'
import { timelineService } from './timelineService'
import httpService from './httpService'
import { makeId } from './utilService'

export const applicantService = {
  getById,
  add,
  update,
  getJobById,
  getDefaultApplicant,
}

const ROUTE = 'applicant'

function getById(applicantId) {
  return httpService.get(`${ROUTE}/${applicantId}`)
}

function add(applicant, jobId) {
  return httpService.post(ROUTE, { applicant, jobId })
}

function update(applicant, jobId) {
  return httpService.put(ROUTE, { applicant, jobId })
}

function getJobById(jobId) {
  return httpService.get(`${ROUTE}/${jobId}`)
}

// TODO: MAKE A TIMEVENTSERVICE JUST LIKE MSGSERVICE

function getDefaultApplicant() {
  return {
    id: makeId(),
    info: null,
    timestamp: {
      sent: null,
      opened: Date.now(),
      submitted: null,
      quited: null,
    },
    answerMap: {},
    timeline: [timelineService.createdJobEvent()],
    notes: [],
    status: 0,
    archivedAt: null,
    isRead: false,
    isFree: false,
  }
}

export function getNote(txt, user) {
  const miniUser = userService.getMiniUser(user)
  return {
    id: makeId(),
    createdAt: Date.now(),
    owner: miniUser,
    txt,
  }
}

