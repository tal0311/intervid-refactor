<template>
  <div class="login">
    <div class="form-container">
      <h2>{{ getTrans('login-title') }}</h2>

      <form @submit.prevent="onLogin" novalidate>
        <main-input inputName="email" :placeholder="getTrans('email')" type="email" validate="required|email"
          v-model.trim="email" :onBlur="validateField" :errors="errors" styled="basic" :disabled="isAuthing"
          autocomplete="email" />

        <main-input inputName="password" :placeholder="getTrans('password')" type="password" validate="required"
          v-model.trim="password" :onBlur="validateField" :errors="errors" styled="basic" :disabled="isAuthing"
          autocomplete="current-password" />

        <span @click="openForgotPassword">{{ getTrans('forgot-my-password') }}</span>

        <div class="errors" v-if="authError">
          {{ getTrans(authError) }}
        </div>

        <button>{{ getTrans('login') }}</button>
      </form>

      <div class="seperator">{{ getTrans('or') }}</div>

      <div class="auth-providers">
        <google-btn @google-success="onGoogleLogin" />
      </div>

      <div class="sign-up-container">
        <p>{{ getTrans('not-have-an-account-yet') }}</p>
        <RouterLink to="/signup">{{ getTrans('signup-and-get-10-interviews') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { validate } from '@/services/errorService.js'
import { mapActions, mapGetters } from 'vuex'

import GoogleBtn from './GoogleBtn.vue'

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: null,
    }
  },

  unmounted() {
    this.clearAuthErr()
  },

  computed: {
    ...mapGetters('auth', ['isAuthing', 'authError']),
  },

  methods: {
    ...mapActions('auth', ['login', 'clearAuthErr']),

    async onLogin({ target }) {
      try {
        this.errors = validate(target)
        if (this.errors.length) return
        const userCred = {
          email: this.email.toLowerCase(),
          password: this.password,
        }
        await this.login({ userCred })
      } catch (error) {
        this.errors = [error]
      }
    },

    async onGoogleLogin(token) {
      const userCred = {
        token,
      }
      await this.login({ userCred })
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

  components: { GoogleBtn },
}
</script>
