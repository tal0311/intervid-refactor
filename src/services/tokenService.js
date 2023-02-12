const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenService = {
  getToken,
  saveToken,
  removeToken,
  getRefreshToken,
  saveRefreshToken,
  removeRefreshToken
}


function getToken(keyPrefix = '') {
  return localStorage.getItem(keyPrefix + TOKEN_KEY)
}

function saveToken(accessToken, keyPrefix = '') {
  localStorage.setItem(keyPrefix + TOKEN_KEY, accessToken)
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

function saveRefreshToken(refreshToken) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
