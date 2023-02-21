<template>
  <section class="verify-email">
    <app-loader v-if="isAuthing" />

    <div v-else-if="!token && user" class="confirm-email">
      <h1>{{ getTrans('confirm-your-email') }}</h1>
      <p>
        {{ `${getTrans('confirm-to-activate')}` }} <span>{{ email }}</span>
      </p>
      <button @click="sendEmailAgain">
        {{ getTrans('send-email-again') }}
      </button>
    </div>

    <div v-else-if="authError" class="confirmation-failed">
      <h2>{{ getTrans('email-confirmation-failed') }}</h2>
      <div>
        <p>{{ getTrans('confirmation-code-doesnt-match') }}</p>
        <p>{{ getTrans('try-resend-confirmation-email') }}</p>
      </div>
      <button @click="sendEmailAgain">
        {{ getTrans('send-email-again') }}
      </button>
    </div>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
import AppLoader from '@/cmps/common/AppLoader.vue'

import {msgService} from '@/services/msgService'

export default {
  async created() {
    try {
      if (!this.token && !this.user) this.$router.push({name: 'Login'})
      if (!this.token) return
      await this.$store.dispatch('auth/verifyEmail', {token: this.token})
      const routeName = this.user ? 'ApplicantOverview' : 'Login'
      this.$router.push({name: routeName})
    } catch (err) {
      if (!this.user) this.$router.push({name: 'Login'})
    } finally {
      console.log('FINALLY')
      // TODO: LOGGER SERVICE HERE
    }
  },

  computed: {
    ...mapGetters('auth', ['authError', 'isAuthing']),

    token() {
      return this.$route.query.token
    },

    email() {
      return this.user.email
    },

    user() {
      return this.$store.getters['user/loggedInUser']
    },
  },

  methods: {
    sendEmailAgain({target}) {
      this.$store.dispatch('auth/sendVerifyEmail')
      const msg = msgService.send('email')
      this.$store.commit('app/setAlertData', {alertData: msg})
      target.disabled = true
      setTimeout(() => {
        target.disabled = false
      }, 5000)
    },
  },

  components: {AppLoader},
}
</script>
