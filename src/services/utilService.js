// import store from '@/store'
import axios from 'axios'
import {breakpoint} from './constData'
import {getDateTrans, getTimeTrans} from './i18nService'

export function getSortFunc(sort) {
  return (a, b) => {
    const modifier = sort.dir === 'desc' ? 1 : -1
    const aVal = Object.byString(a, sort.by) || ''
    const bVal = Object.byString(b, sort.by) || ''
    if (!isNaN(+aVal)) {
      return (+aVal - +bVal) * modifier
    } else {
      if (aVal.toLowerCase() < bVal.toLowerCase()) return -1 * modifier
      if (aVal.toLowerCase() > bVal.toLowerCase()) return 1 * modifier
      return 0
    }
  }
}

export function parseFilter(query) {
  var filterBy = {}
  const searchParams = new URLSearchParams(query)
  for (let [key, value] of searchParams) {
    if (value) {
      if (key === 'statuses') value = value.split(',')
      filterBy[key] = value
    }
  }
  if (filterBy.currPage) filterBy.currPage = +filterBy.currPage
  return filterBy
}

export function verifyBeforeExit(e) {
  e.preventDefault()
  var confirmationMessage = 'Are you sure you want to quit?'
  ;(e || window.event).returnValue = confirmationMessage // Gecko + IE
  return confirmationMessage // Webkit, Safari, Chrome
}

export function secondsToTime(seconds, {isMinutes} = {}) {
  const hrs = Math.floor(seconds / (60 * 60))
  const divisorForMins = seconds % (60 * 60)
  const mins = Math.floor(divisorForMins / 60)
  const divisorForSecs = divisorForMins % 60
  const secs = Math.floor(divisorForSecs)
  if (isMinutes) return `${mins}:${_padNum(secs)}`
  return `${hrs ? _padNum(hrs) + ':' : ''}${_padNum(mins)}:${_padNum(secs)}`
}

/**
 * Formats MS to any desired duration.
 * With no options returns H:M h / M:S min / S sec
 * @param {number} ms
 * @param {{noWords:boolean,singleLetter:boolean,fullWord:boolean}} options
 * @returns string
 */
export function formatDuration(ms, {noWords, singleLetter, fullWord} = {}) {
  let seconds = ms / 1000
  let minutes = parseInt(seconds / 60)
  seconds = Math.round(seconds % 60)
  const hours = parseInt(minutes / 60)
  minutes = Math.round(minutes % 60)

  const timeStr = hours ? _padNum(hours) + ':' + _padNum(minutes) : _padNum(minutes) + ':' + _padNum(seconds)

  if (noWords) return timeStr

  if (!minutes && !hours) {
    const word = singleLetter ? 's' : fullWord ? getPlural('second', seconds) : 'sec'
    return timeStr + ' ' + word
  }
  let word = hours ? 'h' : 'min'
  if (singleLetter) {
    word = hours ? 'h' : 'm'
  } else if (fullWord) {
    word = hours ? getPlural('hour', hours) : getPlural('minute', minutes)
  }
  return timeStr + ' ' + word
}

export function formatDate(date, options = {}) {
  if (typeof date === 'string' || typeof date === 'number') date = new Date(date)
  const now = new Date()
  if (!options.getFullDate && now.getFullYear() === date.getFullYear()) {
    if (now.getDate() === date.getDate() && now.getMonth() === date.getMonth()) {
      return getTimeTrans(date, options.includeSeconds)
    } else {
      return getDateTrans(date)
    }
  } else {
    var timeStr = getTimeTrans(date, options.includeSeconds)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${options.includeTime ? timeStr : ''}`
  }
}

export function makeId(length = 6) {
  let str = ''
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
  }

  return str
}

export async function retry(fn, n) {
  for (let i = 0; i < n; i++) {
    try {
      return await fn()
    } catch (err) {
      console.error('Something went wrong', err)
    }
  }
  throw new Error(`Failed retrying ${n} times`)
}

export function getUrlParamsFromObj(obj) {
  const params = []
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      params.push(key + '=' + obj[key])
    }
  }
  return params.length ? '?' + params.join('&') : ''
}

function _padNum(num) {
  return num >= 10 ? num : '0' + num
}

export const getPlural = (word, count) => (count > 1 ? word + 's' : word)

export const formatNum = (num) => new Intl.NumberFormat().format(num)

export const paginate = (items, currPage = 0, itemsPerPage = 30) => {
  return items.filter((item, index) => {
    const start = currPage * itemsPerPage
    const end = (currPage + 1) * itemsPerPage
    if (index >= start && index < end) return true
  })
}

export function debounce(fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export const isMobileDevice = () =>
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent,
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
    navigator.userAgent.substring(0, 4),
  )

export const isTabletScreen = () => getScreenWidth() < breakpoint.medium

const isMobileScreen = () => getScreenWidth() < breakpoint.medium

const getScreenWidth = () => (window.innerWidth > 0 ? window.innerWidth : screen.width)

export const isMobile = () => isMobileDevice() || isMobileScreen()

// TODO : Refactor to NORMAL CODE
Object.byString = function (obj, key) {
  key = key.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  key = key.replace(/^\./, '') // strip a leading dot
  const a = key.split('.')
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i]
    if (obj[k] !== undefined && obj[k] !== null) {
      obj = obj[k]
    } else {
      return
    }
  }
  return obj
}

export const isEmailValid = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isPhoneValid = (phone) => {
  const re = /^\+?(972|0)(-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/
  return re.test(phone)
}

export const isPasswordValid = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
  return re.test(password)
}

export const getFullName = (user) => {
  if (!user?.fName) return ''
  return `${user.fName.charAt(0).toUpperCase() + user.fName.substring(1)} ${
    user.lName.charAt(0).toUpperCase() + user.lName.substring(1) || ''
  }`
}

export const getInitials = (username) => {
  const parts = username.split(/[ -]/)
  let initials = ''
  for (var i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0)
  }
  if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
    initials = initials.replace(/[a-z]+/g, '')
  }
  initials = initials.substring(0, 3).toUpperCase()
  return initials
}

export const isEmpty = (obj) => {
  return Object.values(obj).every((val) => val === null || val === '' || val === undefined)
}

export function getVideoLength(videoUrl) {
  return new Promise((resolve) => {
    const elVideo = document.createElement('video')
    elVideo.src = videoUrl
    elVideo.onloadedmetadata = () => {
      elVideo.onloadedmetadata = null
      resolve(elVideo.duration)
    }
  })
}

// TODO: This function is by no means a utility function, it should be moved to a different file, probably the store file,
// it is also named as a private function, but it is exported, this is a bad practice, and should be changed.
// making this change will allow us to remove the store import from this file, which is causing problems, because of the circular dependency.
export function _handleCancelRequest(key) {
  const source = axios.CancelToken.source()
  store.dispatch('app/cancelRequest', key)
  store.commit('app/setCancelRequest', {cancel: source.cancel, key})
  return source.token
}

// function deepEqual(object1, object2) {
//   const keys1 = Object.keys(object1)
//   const keys2 = Object.keys(object2)
//   if (keys1.length !== keys2.length) {
//     return false
//   }
//   for (const key of keys1) {
//     const val1 = object1[key]
//     const val2 = object2[key]
//     const areObjects = isObject(val1) && isObject(val2)
//     if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
//       return false
//     }
//   }
//   return true
// }

// function isObject(object) {
//   return object != null && typeof object === 'object'
// }
