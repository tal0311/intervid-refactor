import { templateService } from '@/services/templateService.js'
// import { activityMap } from '@/services/activityService'
import { msgService } from '@/services/msgService'
import { loggerService } from '@/services/loggerService'

export const template = {
  namespaced: true,

  state: {
    templates: [],
    template: null,
    defaultTemplates: [],
    isFetching: false,
  },

  getters: {
    templates(state) {
      return state.templates
    },

    template(state) {
      return state.template
    },

    defaultTemplates(state) {
      return state.defaultTemplates
    },

    isFetching(state) {
      return state.isFetching
    },

  },

  mutations: {
    setTemplates(state, { templates }) {
      state.templates = templates
    },

    setTemplate(state, { template }) {
      state.template = template
    },

    setDefaultTemplates(state, { defaultTemplates }) {
      state.defaultTemplates = defaultTemplates
    },

    addTemplate(state, { template }) {
      state.templates.push(template)
    },

    updateTemplate(state, { template }) {
      const templateIdx = state.templates.findIndex((temp) => temp._id === template._id)
      state.templates.splice(templateIdx, 1, template)
    },

    removeTemplate(state, { templateId }) {
      const templateIdx = state.templates.findIndex((template) => template._id === templateId)
      state.templates.splice(templateIdx, 1)
    },

    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },
  },

  actions: {
    async loadTemplates({ commit }) {
      commit('setIsFetching', true)
      try {
        const templates = await templateService.query({})
        commit('setTemplates', { templates })
      } catch (err) {
        loggerService.error('[templateStore] [loadTemplates] Failed to load templates', err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async loadDefaultTemplates({ rootGetters, state, commit }) {
      try {
        const defaultTemplates = await templateService.getDefaultTemplates()
        commit('setDefaultTemplates', { defaultTemplates })
      } catch (err) {
        loggerService.error('[templateStore] [loadDefaultTemplates] Failed to load default templates', err)
      }
    },

    async loadTemplate({ commit }, { templateId }) {
      commit('setIsFetching', true)
      try {
        const template = templateId ? await templateService.getById(templateId) : templateService.getDefaultTemplate()
        commit('setTemplate', { template })
      } catch (err) {
        loggerService.error('[templateStore] [loadTemplate] Failed to load template', templateId || template._id, err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async saveTemplate({ commit, dispatch, rootGetters }, { template }) {
      if (!template.title) {
        const dateStr = new Date().toLocaleString('he-IL')
        template.title = `Unnamed Template ${dateStr.substring(0, dateStr.length - 3)}`
      }
      try {
        const type = template._id ? 'update' : 'add'
        const savedTemplate = await templateService.save(template)
        commit('setTemplate', { template: savedTemplate })
        commit(type + 'Template', { template: savedTemplate })
        // dispatch(
        //   'activity/addActivity',
        //   activityMap.template({
        //     type,
        //     desc: `name: ${template.title}`,
        //     meta: { templateId: savedTemplate._id },
        //   }),
        //   { root: true },
        // )
        commit('app/setAlertData', { alertData: msgService.save('template') }, { root: true })
      } catch (err) {
        const user = rootGetters['job/userStore'].loggedInUser
        loggerService.error('[templateStore] [saveTemplate] Failed to save template', template?._id, 'for', user._id, err)
        commit('app/setAlertData', { alertData: msgService.failSave('template') }, { root: true })
      }
    },

    async removeTemplate({ dispatch, commit, rootGetters }, { templateId }) {
      try {
        await templateService.remove(templateId)
        // dispatch('activity/addActivity', activityMap.template({ type: 'remove', meta: { templateId } }), { root: true })
        commit('removeTemplate', { templateId })
      } catch (err) {
        const user = rootGetters['job/userStore'].loggedInUser
        loggerService.error('[templateStore] [removeTemplate] Failed to remove template', templateId, 'for', user._id, err)
        commit('app/setAlertData', { alertData: msgService.failRemove('template') }, { root: true })
      }
    },

    async toggleArchivedTemplate({ commit, dispatch }, { template }) {
      var updatedTemplate = {
        ...template,
        archivedAt: template.archivedAt ? null : Date.now(),
      }

      try {
        await templateService.save(updatedTemplate)
        commit('updateTemplate', { template: updatedTemplate })

        // const type = updatedTemplate.archivedAt ? 'remove' : 'restore'
        // dispatch(
        //   'activity/addActivity',
        //   activityMap.template({
        //     type,
        //     desc: `name: ${updatedTemplate.name}`,
        //     meta: { templateId: updatedTemplate._id },
        //   }),
        //   { root: true },
        // )
      } catch (err) {
        loggerService.error(err)
        commit('app/setAlertData', { alertData: msgService.failArchive('template') }, { root: true })
      }
    },

    toggleIsDefault({ dispatch, getters }, { template }) {
      const prevDefaultTemplate = getters.templates.find((temp) => temp.isDefault)
      if (prevDefaultTemplate)
        dispatch('saveTemplate', {
          template: {
            ...prevDefaultTemplate,
            isDefault: false,
          },
        })

      dispatch({ type: 'saveTemplate', template })
    },
  },
}
