import { loggerService } from '@/services/loggerService'
import { userService } from '@/services/userService.js'
import { msgService } from '@/services/msgService'
import httpService from '@/services/httpService'

export const user = {
  namespaced: true,

  state: {
    viewAsUser: null,
    loggedInUser: null,
    loggedInUserPrm: null,
    users: [],
    isFetching: false,
  },

  getters: {
    viewAsUser(state) {
      return state.viewAsUser
    },

    loggedInUser(state) {
      return state.loggedInUser
    },

    loggedInUserPrm(state) {
      return state.loggedInUserPrm
    },

    loggedInUserAdvancedPrm(state) {
      return state.loggedInUser?.advancedPrm
    },

    users(state) {
      return state.users
    },

    isFetching(state) {
      return state.isFetching
    },
  },

  mutations: {
    setLoggedInUser(state, { user }) {
      state.loggedInUser = user
      state.loggedInUserPrm = user ? user.perm : null
    },

    setUsers(state, { users }) {
      state.users = users
    },

    updateUser(state, { user }) {
      const userIdx = state.users.findIndex((_user) => _user._id === user._id)
      state.users.splice(userIdx, 1, user)
      return userIdx
    },

    removeUser(state, { userId }) {
      state.users = state.users.filter((user) => user._id !== userId)
    },

    addUser(state, { user }) {
      state.users.push(user)
    },

    setLoggedInUserPrm(state, prm) {
      state.loggedInUserPrm = prm
    },

    setViewAsUser(state, { viewAsUser }) {
      state.viewAsUser = viewAsUser
    },

    setIsFetching(state, isFetching) {
      state.isFetching = isFetching
    },
  },

  actions: {
    async loadUsers({ commit, dispatch }) {
      commit('setIsFetching', true)
      try {
        // #HANDLE CANCEL
        const key = 'job/getExpectedApplicantCount'
        const cancelToken = await dispatch('app/handleCancelRequest', key, { root: true })
        const users = await userService.query(cancelToken)
        commit('setUsers', { users })
      } catch (err) {
        // TODO: LOGGER HERE
        console.log('Error from user store, loadUsers', err)
      } finally {
        commit('setIsFetching', false)
      }
    },

    async removeUser({ commit }, { userId }) {
      try {
        await userService.remove(userId)
        commit('removeUser', { userId })
      } catch (err) {
        loggerService.error('[userStore] [removeUser]', err)
      }
    },

    async updateUser({ commit, state }, { user }) {
      try {
        const updatedUser = await userService.update(user)
        commit('updateUser', { user: updatedUser })
        commit('app/setAlertData', { alertData: msgService.update('user') }, { root: true })
        if (updatedUser._id === state.loggedInUser._id) commit('setLoggedInUser', { user: updatedUser })
      } catch (err) {
        loggerService.error('[userStore] [updateUser]', err)
        throw err
      }
    },

    async addUser({ commit }, { user }) {
      try {
        const newUser = await userService.add(user)
        commit('app/setAlertData', { alertData: msgService.add('user') }, { root: true })
        commit('addUser', { user: newUser })
      } catch (err) {
        if (!err.isValidation) {
          commit('app/setAlertData', { alertData: msgService.failAdd('user') }, { root: true })
        }
        loggerService.error('[userStore] [addUser]', err)
        throw err
      }
    },

    async changePassword(context, { newPassword, userId }) {
      try {
        await userService.changePassword(userId, newPassword)
      } catch (err) {
        loggerService.error('[userStore] [changePassword]', err)
        throw err
      }
    },

    sendVerifyEmail({ getters }) {
      return userService.sendVerifyEmail(getters.loggedInUser)
    },

    async loadLoggedUser({ commit }) {
      const loggedInUserPrm = userService.getLoggedInUser()
      commit('setLoggedInUserPrm', loggedInUserPrm)

      httpService.mount401Interceptor()
      const user = await loggedInUserPrm
      commit('setLoggedInUser', { user })
    },
  },
}
