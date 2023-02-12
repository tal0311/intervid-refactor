<template>
  <section class="forgot-password">
    <div class="content">
      <component :is="componentToShow" @on-next-step="onNextStep" :email="email">
        <div class="error" v-if="authError">
          {{getTrans(authError)}}
        </div>
      </component>
    </div>
  </section>
</template>

<script>
import { msgService } from '@/services/msgService'

import ChangePasswordForm from '@/cmps/forgot-password/ChangePasswordForm.vue'
import ResetPasswordForm from '@/cmps/forgot-password/ResetPasswordForm.vue'
import EnterEmailForm from '@/cmps/forgot-password/EnterEmailForm.vue'
import EnterCodeForm from '@/cmps/forgot-password/EnterCodeForm.vue'

export default {
  props: {
    isChangePass: Boolean,
  },

  data() {
    return {
      currStep: 0,
      cmps: {
        0: EnterEmailForm,
        1: ResetPasswordForm,
        2: ChangePasswordForm,
        3: EnterCodeForm,
      },
      setOption: '',
      email: '',
      userToEdit: null,
      password: {
        updated: '',
        verifyUpdated: '',
      },
    }
  },

  created() {
    this.userToEdit = this.$store.getters['user/loggedInUser']
    this.currStep = this.isChangePass ? 2 : 0
  },

  computed: {
    componentToShow() {
      return this.cmps[this.currStep]
    },

    authError() {
      return this.$store.getters['auth/authError']
    },

    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },
  },

  methods: {
    async onNextStep(res) {
      switch (this.currStep) {
        case 0:
          this.email = res.email
          this.verifyEmail(res.setOption)
          break
        case 1:
          this.verifyCode(res.enteredCode)
          break
        case 2:
          this.onChangePassword(res)
          break
        case 3:
          this.verifyOtp(res.enteredCode)
          break
      }
    },

    async verifyEmail(setOption) {
      try {
        await this.$store.dispatch('auth/resetPassword', { email: this.email.toLowerCase() })
        this.currStep = setOption === 'RMP' ? 1 : 3
      } catch (err) {}
    },

    async verifyCode(enteredCode) {
      try {
        await this.$store.dispatch('auth/verifyCode', { enteredCode })
        this.currStep = 2
      } catch (err) {}
    },

    async onChangePassword({ updated, verifyUpdated }) {
      this.password.updated = updated
      this.password.verifyUpdated = verifyUpdated
      if (this.userToEdit) {
        await this.$store.dispatch('user/changePassword', {
          newPassword: this.password.updated,
          userId: this.userToEdit._id,
        })
      } else {
        await this.$store.dispatch('auth/changePassword', {
          email: this.email,
          password: this.password.updated,
        })
      }
      const moveTo = this.loggedInUser ? 'UserMgmt' : 'Login'
      this.$router.push({ name: moveTo })
      const msg = msgService.change('password')
      this.$store.commit('app/setAlertData', { alertData: msg })
    },

    async verifyOtp(enteredCode) {
      try {
        await this.$store.dispatch('auth/loginWithOtp', { email: this.email, enteredCode })
        this.$router.push({ name: 'ApplicantOverview' })
      } catch (err) {}
    },
  },

  component: {
    EnterEmailForm,
    ResetPasswordForm,
    ChangePasswordForm,
    EnterCodeForm,
  },
}
</script>
