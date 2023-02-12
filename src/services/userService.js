import { permissions } from './constData'
import httpService from './httpService'
import store from '../store'
import { _handleCancelRequest } from './utilService'

export const userService = {
  query,
  getById,
  add,
  update,
  remove,
  getLoggedInUser,
  sendVerifyEmail,
  sendVerifyEmailCode,
  verifyApplicant,
  verifyPerm,
  changePassword,
  getEmptyUser,
  getMiniUser,
}

const BASE_URL = 'user/'

function query() {
  const key = 'user/query'
  const token = _handleCancelRequest(key)

  return httpService.customRequest('get', BASE_URL, null, { cancelToken: token })
}

function getById(userId) {
  return httpService.get(`${BASE_URL}${userId}`)
}

function add(user) {
  return httpService.post(BASE_URL, user)
}

function update(user) {
  return httpService.put(BASE_URL, { user })
}

function remove(userId) {
  return httpService.delete(`${BASE_URL}${userId}`)
}

async function getLoggedInUser() {
  try {
    const user = await httpService.get(`${BASE_URL}logged`)
    return user
  } catch (err) { }
}

function sendVerifyEmail(user) {
  return httpService.post(`${BASE_URL}verify-email`, { user })
}

function sendVerifyEmailCode(user) {
  return httpService.post(`${BASE_URL}verify-email-code`, { user })
}

function verifyApplicant(applicantId, code) {
  return httpService.post(`${BASE_URL}verify-applicant`, { userId: applicantId, code })
}

function verifyPerm(requieredPerm, user = store.getters['user/loggedInUser']) {
  const userAdvancedPerm = store.getters['user/loggedInUserAdvancedPrm']
  const userPerm = Object.values(permissions).find(perm => perm.id === user.perm)
  return (
    !requieredPerm.isBlocked &&
    (requieredPerm.originalPerm.code <= userPerm.code ||
      (userAdvancedPerm && userAdvancedPerm[requieredPerm.name]))
  )
}

function changePassword(userId, newPassword) {
  return httpService.put(`${BASE_URL}password/` + userId, { newPassword, userId })
}

function getEmptyUser() {
  return {
    email: '',
    password: '',
    fName: '',
    lName: '',
    imgUrl: '',
    perm: 'starter',
    advancedPrm: {},
  }
}

function getMiniUser({ fName, lName, _id, companyId, imgUrl, email }) {
  return {
    _id,
    fName,
    lName,
    companyId,
    imgUrl,
    email,
  }
}

