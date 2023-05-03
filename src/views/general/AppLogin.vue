<template>
  <div class="login">
    <div class="form-container">
      <h2>{{ $getTrans('login-title') }}</h2>

      <form novalidate @submit.prevent="onLogin">
        <main-input
          v-model.trim="email"
          input-name="email"
          :placeholder="$getTrans('email')"
          type="email"
          validate="required|email"
          :on-blur="validateField"
          :errors="errors"
          styled="basic"
          :disabled="isAuthing"
          autocomplete="email"
        />

        <main-input
          v-model.trim="password"
          input-name="password"
          :placeholder="$getTrans('password')"
          type="password"
          validate="required"
          :on-blur="validateField"
          :errors="errors"
          styled="basic"
          :disabled="isAuthing"
          autocomplete="current-password"
        />

        <span @click="openForgotPassword">{{ $getTrans('forgot-my-password') }}</span>

        <div v-if="authError" class="errors">
          {{ $getTrans(authError) }}
        </div>

        <button>{{ $getTrans('login') }}</button>
      </form>

      <div class="seperator">{{ $getTrans('or') }}</div>

      <div class="auth-providers">
        <GoogleBtn @google-success="onGoogleLogin" />
      </div>

      <div class="sign-up-container">
        <p>{{ $getTrans('not-have-an-account-yet') }}</p>
        <RouterLink to="/signup">{{ $getTrans('signup-and-get-10-interviews') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import {validate} from '@/services/errorService.js'
import {mapActions, mapGetters} from 'vuex'

import GoogleBtn from './GoogleBtn.vue'

export default {
  components: {GoogleBtn},
  data() {
    return {
      email: '',
      password: '',
      errors: null,
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthing', 'authError']),
  },
  unmounted() {
    this.clearAuthErr()
  },

  methods: {
    ...mapActions('auth', ['login', 'clearAuthErr']),

    async onLogin({target}) {
      try {
        this.errors = validate(target)
        if (this.errors.length) return
        const userCred = {
          email: this.email.toLowerCase(),
          password: this.password,
        }
        await this.login({userCred})
      } catch (error) {
        this.errors = [error]
      }
    },

    async onGoogleLogin(token) {
      const userCred = {
        token,
      }
      await this.login({userCred})
    },

    openForgotPassword() {
      this.$router.push('forgot-password')
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },
  },
}
</script>
