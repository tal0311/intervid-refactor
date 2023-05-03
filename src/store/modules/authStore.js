import {authService} from '../../services/authService'
// import { activityMap } from '@/services/activityService'
import {loggerService} from '@/services/loggerService'
import router from '@/router'
import {userService} from '../../services/userService'

export const auth = {
  namespaced: true,

  state: {
    isAuthing: false,
    authError: '',
    refreshTokenPrm: null,
  },

  getters: {
    authError(state) {
      return state.authError
    },

    isAuthing(state) {
      return state.isAuthing
    },
    verifyPerm: (state, getters, rootState, rootGetters) => (requieredPerm) => {
      const user = rootGetters['user/loggedInUser']
      const userAdvancedPerm = rootGetters['user/loggedInUserAdvancedPrm']
      return userService.verifyPerm(requieredPerm, user, userAdvancedPerm)
    },
  },

  mutations: {
    loginRequest(state) {
      state.isAuthing = true
      state.authError = ''
    },

    loginSuccess(state) {
      state.isAuthing = false
    },

    setAuthError(state, {msg}) {
      state.isAuthing = false
      state.authError = msg
    },

    refreshTokenPrm(state, prm) {
      state.refreshTokenPrm = prm
    },

    logoutSuccess(state) {
      state.isAuthing = false
      state.authError = ''
      state.refreshTokenPrm = null
    },
  },

  actions: {
    async login({commit}, {userCred}) {
      // {dispatch}
      commit('loginRequest')
      try {
        const user = await authService.login(userCred)
        commit('loginSuccess')
        await commit('user/setLoggedInUser', {user}, {root: true})
        // dispatch('activity/addActivity', activityMap.user({ type: 'login' }), { root: true })

        router.push({name: 'ApplicantOverview'})
      } catch (err) {
        loggerService.error("[authStore] [login] - Couldn't login user:", userCred.email, err)
        commit('setAuthError', err)
        throw err
      }
    },

    async signup({commit}, {userCred}) {
      // {dispatch}
      commit('loginRequest')
      try {
        const user = await authService.signup(userCred)
        commit('loginSuccess')
        commit('user/setLoggedInUser', {user}, {root: true})
        // dispatch('activity/addActivity', activityMap.user({ type: 'signup' }), { root: true })
        // TODO: Redirect the user to the page he first tried to visit or to the home view
        router.push({name: 'VerifyEmail'})
        return true
      } catch (err) {
        loggerService.error("[authStore] [signup] - Couldn't signup", err)
        commit('setAuthError', err)
        return false
      }
    },

    logout({commit}) {
      // {commit, dispatch}
      // dispatch('activity/addActivity', activityMap.user({ type: 'logout' }), { root: true })
      authService.logout()
      commit('logoutSuccess')
      commit('user/setLoggedInUser', {user: null}, {root: true})
      commit('resetState', null, {root: true})
      router.push({name: 'Login'})
    },

    refreshToken({commit, state}) {
      if (state.refreshTokenPrm) return state.refreshTokenPrm
      const prm = authService
        .getNewToken()
        .then((accessToken) => {
          commit('refreshTokenPrm', null)
          commit('loginSuccess', accessToken)
        })
        .catch((err) => {
          loggerService.error('[authStore] [refreshToken] - Failed to get refresh token', err)
          commit('refreshTokenPrm', null)
        })
      commit('refreshTokenPrm', prm)
      return prm
    },

    async resetPassword({commit}, {email}) {
      try {
        await authService.resetPassword(email)
      } catch (err) {
        loggerService.error("[authStore] [resetPassword] - Couldn't reset password for", email, err)
        commit('setAuthError', err)
        throw err
      }
    },

    async changePassword({commit}, {email, password}) {
      // {dispatch}
      try {
        await authService.changePassword(email, password)
        // dispatch('activity/addActivity', { type: 'change', target: 'User Password' }, { root: true })
      } catch (err) {
        loggerService.error("[authStore] [changePassword] - Couldn't change password for", email, err)
        commit('setAuthError', err)
        throw err
      }
    },

    async verifyEmail({commit}, {token}) {
      try {
        commit('loginRequest')
        const user = await authService.verifyEmail(token)
        commit('loginSuccess')
        commit('user/setLoggedInUser', {user}, {root: true})
      } catch (err) {
        loggerService.error("[authStore] [verifyEmail] - Couldn't verify Email:", err)
        commit('setAuthError', err)
        throw err
      }
    },

    async verifyCode({commit}, {enteredCode}) {
      try {
        await authService.verifyCode(enteredCode)
      } catch (err) {
        commit('setAuthError', err)
        loggerService.error('[authStore] [verifyCode] - Verification Unsuccessful', err)
        throw err
      }
    },

    async loginWithOtp({commit}, {email, enteredCode}) {
      // {dispatch}
      commit('loginRequest')
      try {
        const user = await authService.loginWithOtp(email, enteredCode)
        commit('loginSuccess')
        commit('user/setLoggedInUser', {user}, {root: true})
        // dispatch('activity/addActivity', { type: 'login', target: 'User' }, { root: true })
      } catch (err) {
        loggerService.error("[authStore] [loginWithOtp] - Couldn't login with Otp - user:", email, err)
        commit('setAuthError', err)
        throw err
      }
    },

    async sendVerifyEmail({commit}) {
      try {
        await authService.sendVerifyEmail()
      } catch (err) {
        loggerService.error('[authStore] [sendVerifyEmail] - Failed to send verification email ', err)
        commit('setAuthError', err)
        throw err
      }
    },

    async clearAuthErr({commit}) {
      commit('setAuthError', {msg: ''})
    },
  },
}
