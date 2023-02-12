import httpService from './httpService'
import { getUrlParamsFromObj } from './utilService'

export const activityService = {
  query,
  addActivity,

}

const ROUTE = 'activity'

function query(filterBy) {
  const { itemsPerPage, currPage } = filterBy
  delete filterBy.itemsPerPage
  delete filterBy.currPage
  const filterQuery = getUrlParamsFromObj(filterBy)
  return httpService.get(`${ROUTE}?limit=${itemsPerPage}&skip=${currPage * itemsPerPage}&${filterQuery.substr(1)}`)
}

function addActivity(activity) {
  return httpService.post(ROUTE, { activity })
}

function _createActivity({ type, target, desc = '', meta = {} }) {
  return {
    date: Date.now(),
    type,
    target,
    desc,
    meta,
  }
}

export const activityMap = {
  user({ type }) {
    const activity = _createActivity({
      type,
      target: 'by user',
    })
    return { activity }
  },
  userPassword({ type }) {
    const activity = _createActivity({
      type,
      target: 'User Password',
    })
    return { activity }
  },
  applicant({ type, desc }) {
    const activity = _createActivity({
      type,
      desc,
      target: 'applicant',
    })
    return { activity }
  },
  job({ type, desc, meta }) {
    const activity = _createActivity({
      type,
      desc,
      meta,
      target: 'job',
    })
    return { activity }
  },
  template({ type, desc, meta }) {
    const activity = _createActivity({
      type,
      desc,
      meta,
      target: 'template',
    })
    return { activity }
  },
  status({ desc }) {
    const activity = _createActivity({
      type: 'update',
      target: 'status',
      desc,
    })
    return { activity }
  },
  note({ type, desc }) {
    const activity = _createActivity({
      type,
      desc,
      target: 'note',
    })
    return { activity }
  },
  watch({ desc }) {
    const activity = _createActivity({
      type: 'watch',
      desc,
      target: 'interview',
    })
    return { activity }
  },
}
