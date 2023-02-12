import httpService from './httpService'
import { tokenService } from './tokenService'

export const authService = {
  signup,
  login,
  loginWithOtp,
  logout,
  resetPassword,
  changePassword,
  verifyEmail,
  verifyCode,
  getNewToken,
  sendVerifyEmail
}

const BASE_URL = 'auth/'


async function signup(userCred) {
  const { accessToken, refreshToken, user } = await httpService.post(`${BASE_URL}signup`, userCred)
  httpService.mount401Interceptor()
  _handleLogin(accessToken, refreshToken)
  return user
}

async function login(userCred) {
  const { accessToken, refreshToken, user } = await httpService.post(`${BASE_URL}login`, userCred)
  if (accessToken && refreshToken) {
    httpService.mount401Interceptor()
    _handleLogin(accessToken, refreshToken)
  }
  return user
}

async function loginWithOtp(email, enteredCode) {
  const { accessToken, refreshToken, user } = await httpService.post(`${BASE_URL}login-otp`, { email, enteredCode })
  if (accessToken && refreshToken) {
    httpService.mount401Interceptor()
    _handleLogin(accessToken, refreshToken)
  }
  return user
}

function logout() {
  httpService.post(`${BASE_URL}logout`)
  httpService.unmount401Interceptor()
  tokenService.removeToken()
  tokenService.removeRefreshToken()
}

async function resetPassword(email) {
  return await httpService.post(`${BASE_URL}reset-password`, { email })
}

function changePassword(email, password) {
  return httpService.put(`${BASE_URL}change-password`, { email, password })
}

async function verifyEmail(code) {
  const { accessToken, refreshToken, user } = await httpService.put(`${BASE_URL}verify-email`, { code })
  httpService.mount401Interceptor()
  _handleLogin(accessToken, refreshToken)
  return user
}

async function verifyCode(enteredCode) {
  const { isVerified } = await httpService.put(`${BASE_URL}verify-code`, { enteredCode })
  httpService.mount401Interceptor()
  return isVerified
}

async function getNewToken() {
  const oldRefreshToken = tokenService.getRefreshToken()
  const { accessToken, refreshToken } = await httpService.post(`${BASE_URL}token`, {
    refreshToken: oldRefreshToken,
  })
  tokenService.saveToken(accessToken)
  tokenService.saveRefreshToken(refreshToken)
  return accessToken
}

function _handleLogin(accessToken, refreshToken) {
  tokenService.saveToken(accessToken)
  tokenService.saveRefreshToken(refreshToken)
}

function sendVerifyEmail(user) {
  return httpService.post(`${BASE_URL}send-verify-email`)
}
