import httpService from './httpService'
import {getTrans} from './i18nService'
import { utilService} from './utilService'

export const templateService = {
  query,
  getById,
  save,
  remove,
  getDefaultTemplates,
  getDefaultTemplate,
  createQuest,
  getDefaultQuests,
  createAns,
  getDefaultAnsRule,
}

const ROUTE = 'template'

async function query(filterBy) {
  const filterUrlParam = utilService.getUrlParamsFromObj(filterBy)
  return await httpService.get(ROUTE + filterUrlParam)
}

function getById(templateId) {
  return httpService.get(`${ROUTE}/${templateId}`)
}

async function save(template) {
  return template._id ? await _update(template) : await _add(template)
}

function _add(template) {
  return httpService.post(ROUTE, template)
}

function _update(template) {
  return httpService.put(ROUTE, template)
}

function remove(templateId) {
  return httpService.delete(`${ROUTE}/${templateId}`)
}

function getDefaultTemplates() {
  return httpService.get(`${ROUTE}/default`)
}

function getDefaultTemplate() {
  const createdAt = new Date()
  return {
    title: `${getTrans('new-template')} - ${createdAt.toLocaleDateString()}`,
    quests: getDefaultQuests(),
  }
}

function createQuest(txt = getTrans('question'), desc = '', ansRule, timeLimit = 5) {
  return {
    id: utilService.makeId(),
    txt,
    desc,
    vidUrl: '',
    ansRule: ansRule || getDefaultAnsRule(true),
    timeLimit,
  }
}

function getDefaultQuests() {
  return [createQuest('Introduce yourself', '<p>Tell us a bit about yourself</p>')]
}

function createAns() {
  return {
    resTime: 0,
    txt: '',
    faceKey: '',
    screenKey: '',
  }
}

function getDefaultAnsRule(isNewAns) {
  return {
    isVidAns: !!isNewAns,
    isTxtAns: false,
    isImgAns: false,
    isScreenAns: false,
    isCodeAns: false,
  }
}

export function filterTemplates(templates, filterBy) {
  const {txt, showArchived} = filterBy
  const regexTxt = new RegExp(txt || '', 'i')
  return templates.filter((temp) => {
    if (showArchived) return temp.archivedAt && (regexTxt.test(temp.name) || regexTxt.test(this.$getFullName(temp.owner)))
    return !temp.archivedAt && (regexTxt.test(temp.title) || regexTxt.test(this.$getFullName(temp.owner)))
  })
}
