import { getTrans } from '../services/i18nService.js'

// Empty array means all values are valid
const sortableHeaders = {
  job: [
    { txt: 'job', key: 'info.title' },
    { txt: 'location', key: 'info.location' },
    { txt: 'applicants', key: '' },
    { txt: 'date', key: 'createdAt', class: 'short' },
    { txt: 'application-link' },
    { txt: '', key: '' },
  ],
  applicant: [
    { txt: '', key: '', class: 'avatar' },
    { txt: 'applicant', key: 'info.fName', class: 'applicant-name' },
    { txt: 'job', key: 'jobInfo.title', class: 'job-title' },
    { txt: 'hometown', key: 'info.hometown', class: 'hometown' },
    { txt: 'status', key: 'status', class: 'status' },
    { txt: 'date', key: 'timestamp.submitted', class: 'date' },
  ],
  template: [
    { txt: 'template-name', key: 'title' },
    { txt: 'creator', key: 'owner.fName' },
    { txt: 'creation-date', key: 'createdAt' },
    { txt: '', key: '', class: 'short' },
    { txt: '', key: '', class: 'short' },
  ],
  account: [
    { txt: 'account-name', key: 'fName' },
    { txt: 'email', key: 'email' },
    { txt: 'last-login', key: 'lastLogin' },
    { txt: 'interviews' },
    { txt: 'plan' },
    { txt: '', key: '' },
  ],
  record: [
    { txt: 'date', key: 'timestamp' },
    { txt: 'source', key: 'meta.source' },
    { txt: 'level', key: 'level' },
    { txt: 'message', key: 'message', class: 'long' },
    { txt: 'trace-id', key: 'meta.traceId' },
  ],
  activity: [
    { txt: 'date', key: 'date' },
    { txt: 'account-Email', key: 'user.email' },
    { txt: 'activity', key: 'page.name' },
  ],
}

export function getSortableHeaders(path, filterBy) {
  const overviewKeys = Object.keys(sortableHeaders)
  const overviewKey = overviewKeys.find((overview) => path.includes(overview))
  const headers = sortableHeaders[overviewKey]
  return headers
}



export const filterDates = [
  { label: 'last-week', daysAgo: '7', id: 'last-week' },
  { label: 'last-month', daysAgo: '31', id: 'last-month' },
  { label: 'last-3-months', daysAgo: '90', id: 'last-3-months' },
]

export const statusMap = {
  0: { label: 'need-evaluation', color: '#a3a7b2', id: 'needEvaluation' },
  1: { label: 'not-a-fit', color: '#FF6666', id: 'notAFit' },
  2: { label: 'maybe', color: '#FBAF3C', id: 'maybe' },
  3: { label: 'good-fit', color: '#7DE54D', id: 'goodFit' },
  4: { label: 'proceed-to-recruitment', color: '#66B8FF', id: 'proceed' },
  5: { label: 'offer-sent', color: '#33A0FF', id: 'offerSent' },
  6: { label: 'not-interested', color: '#F94848', id: 'notInterested' },
  7: { label: 'hired', color: '#5DCE27', id: 'hired' },
}

export function getStatusByCode(code) {
  return statusMap[code]
}

const answerTypeMap = {
  isVidAns: 'video-answer',
  isCodeAns: 'code-answer',
  isScreenAns: 'screen-answer',
  isTxtAns: 'text-answer',
  isImgAns: 'image-answer',
}

export function getAnswerType(type) {
  return answerTypeMap[type]
}

export const breakpoint = {
  small: 760,
  medium: 1100,
  large: 1460,
}

const defaultFilters = {
  ApplicantOverview: {
    txt: '',
    statuses: [],
    daysAgo: '',
    currPage: 0,
    itemsPerPage: 30,
    jobId: null,
  },

  JobOverview: {
    txt: '',
    itemsPerPage: 30,
    currPage: 0,
    jobId: null,
    daysAgo: '',
  },

  TemplateOverview: {
    itemsPerPage: 30,
  },

  ActivityOverview: {
    txt: '',
    fromDate: '',
    toDate: '',
    userId: null,
    itemsPerPage: 50,
  },

  RecordOverview: {
    txt: '',
    levels: 'http,debug,info,warn,error',
    source: '',
    traceID: '',
    statusCode: '',
    exclude: false,
    fromDate: '',
    toDate: '',
    itemsPerPage: 50,
  },
}

export function getDefaultFilter(cmpName) {
  return defaultFilters[cmpName] || {}
}

const defaultSort = {
  ApplicantOverview: {
    by: 'timestamp.submitted',
    dir: 'desc',
  },

  JobOverview: {
    by: 'createdAt',
    dir: 'desc',
  },

  TemplateOverview: {
    by: 'createdAt',
    dir: 'asc',
  },

  AccountOverview: {
    by: 'fName',
    dir: 'desc',
  },

  ActivityOverview: {
    by: 'data',
    dir: 'asc',
  },

  RecordOverview: {
    by: 'timestamp',
    dir: 'desc',
  },
}

export function getDefaultSort(cmpName) {
  return defaultSort[cmpName] || { by: 'createdAt', dir: 'desc' }
}

export const tooltips = {
  'job-details':
    'Editing detailed job information can help potential candidates understand whether the job is relevant to them and encourage them to submit a video interview for the job',
  'invitation-preview': 'This is a preview of the job application form as it will be presented to potential candidates',
  'interview-questions':
    'Edit custom interview questions can help you get the relevant information from your potential candidates',
  'interview-preview':
    'This is a preview of the question as it will be presented to potential candidates during the interview',
}

export const permissions = {
  STARTER: {
    id: 'starter',
    code: 0
  },
  BASIC: {
    id: 'basic',
    code: 1
  },
  PROFESSIONAL: {
    id: 'professional',
    code: 2
  },
  ENTERPRISE: {
    id: 'enterprise',
    code: 3
  },
  ALL_FEATURES: {
    id: 'all-features',
    code: 999
  }
}

export const advancedPermsMap = {
  VIDEO_ANS: { name: 'video-answer', originalPerm: permissions.STARTER },
  UNLIMITED_INTERVIEWS: { name: 'unlimited-interviews', originalPerm: permissions.BASIC },
  SCREEN_ANS: { name: 'screen-answer', originalPerm: permissions.PROFESSIONAL },
  TEMPLATES: { name: 'templates', originalPerm: permissions.ENTERPRISE , isBlocked: true},
  // not implemented yet ↓
  TEXT_ANS: { name: 'text-answer', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  IMAGE_ANS: { name: 'image-answer', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  CODE_ANS: { name: 'code-answer', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  MULT_CHOICE_ANS: { name: 'mult-choice-answer', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  BOOKMARKS: { name: 'bookmarks', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  MULT_USER_ORG: { name: 'mult-user-org', originalPerm: permissions.ENTERPRISE , isBlocked: true },
  MULT_DEPARTMENT_ORG: { name: 'mult-department-org', originalPerm: permissions.ENTERPRISE , isBlocked: true },
}

export const supportedBrowsersMap = {
  chrome: 72,
  crios: 11, // chrome in ios
  safari: 14,
  ios: 11, // chrome in ios
  firefox: 52,
  fxios: 11, // firefox in ios
  'edge-chromium': 79,
}

export const ansRules = [
  { txt: 'video-answer', icon: 'videocam', type: 'isVidAns', permission: 'VIDEO_ANS' },
  { txt: 'screen-answer', icon: 'desktop_windows', type: 'isScreenAns', permission: 'SCREEN_ANS' },
  { txt: 'text-answer', icon: 'notes', type: 'isTxtAns', permission: 'TEXT_ANS' },
  { txt: 'image-answer', icon: 'cloud_upload', type: 'isImgAns', permission: 'IMAGE_ANS' },
  { txt: 'code-answer', icon: 'code', type: 'isCodeAns', permission: 'CODE_ANS' },
]

export function getTimeLimits() {
  const minutes = getTrans('mini-minutes')
  return [
    { txt: `1${minutes}`, value: '1' },
    { txt: `2${minutes}`, value: '2' },
    { txt: `5${minutes}`, value: '5' },
    { txt: `10${minutes}`, value: '10' },
    { txt: `20${minutes}`, value: '20' },
    { txt: `30${minutes}`, value: '30' },
  ]
}

export const coverImgs = [
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1667828392/Frontend/5381531-16_an47ji.png' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1667828391/Frontend/5381531-18_eakalu.png' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819330/Frontend/5381531-13_izqgdy.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819330/Frontend/5381531-09_mrbjpp.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819329/Frontend/5381531-15_sjrxux.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819329/Frontend/5381531-20_eqomv5.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819322/Frontend/5381531-17_vs1d6p.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819321/Frontend/5381531-12_pnnfsr.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819321/Frontend/5381531-08_qdy6gd.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819307/Frontend/5381531-04_n1p2zw.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819304/Frontend/5381531-10_cwnbq6.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819301/Frontend/5381531-02_fjqibg.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819297/Frontend/5381531-01_dubcar.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819298/Frontend/5381531-06_aw6yac.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819297/Frontend/5381531-03_eorcsv.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819297/Frontend/5381531-05_hrkfve.jpg' },
  { regular: 'https://res.cloudinary.com/intervid/image/upload/v1672819335/Frontend/5381531-19_tlfznf.jpg' },
]
export const defaultImgUrl = {
  jobCover: 'https://res.cloudinary.com/intervid/image/upload/v1666167409/Frontend/5381531-17_vs1d6p.jpg',
}
