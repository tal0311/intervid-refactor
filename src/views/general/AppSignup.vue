<template>
  <div class="sign-up">
    <div class="narrow-container">
      <div class="content">
        <div class="content-header">
          <h1>{{ $getTrans('signup-header') }}</h1>
          <p>{{ $getTrans('signup-subheading') }}</p>
        </div>

        <div class="advantages">
          <p>
            <i class="material-icons"> check_circle </i>
            <span>{{ $getTrans('free-10-video-trial') }}</span>
          </p>
          <p>
            <i class="material-icons"> check_circle </i>
            <span>{{ $getTrans('no-credit-card-required') }}</span>
          </p>
          <p>
            <i class="material-icons"> check_circle </i>
            <span>{{ $getTrans('EasyToUse') }}</span>
          </p>
          <p>
            <i class="material-icons"> check_circle </i>
            <span>{{ $getTrans('recruit-anywhere-with-mobile') }}</span>
          </p>
        </div>
      </div>

      <div class="form-container">
        <h2>{{ $getTrans('create-your-account') }}</h2>

        <div class="small">
          <p>{{ $getTrans('get-10-video-for-free') }}</p>
          <p>{{ $getTrans('no-credit-card-required') }}</p>
        </div>
        <form @submit.prevent="onSignup" novalidate>
          <div class="input-container">
            <main-input
              type="text"
              inputName="fName"
              :placeholder="$getTrans('first-name')"
              validate="required"
              v-model.trim="userCred.fName"
              :onBlur="validateField"
              :errors="errors"
              styled="basic"
            />
            <main-input
              type="text"
              inputName="lName"
              :placeholder="$getTrans('last-name')"
              validate="required"
              v-model.trim="userCred.lName"
              :onBlur="validateField"
              :errors="errors"
              styled="basic"
            />
          </div>

          <main-input
            type="email"
            inputName="email"
            :placeholder="$getTrans('email')"
            validate="required|email"
            v-model.trim="userCred.email"
            :onBlur="validateField"
            :errors="errors"
            styled="basic"
          />

          <main-input
            type="password"
            inputName="password"
            :placeholder="$getTrans('password') + ' ' + $getTrans('at-least-6-char')"
            validate="required|password"
            v-model.trim="userCred.password"
            :onBlur="validateField"
            :errors="errors"
            styled="basic"
            autocomplete="new-password"
          />
          <main-input
            type="password"
            inputName="confirmPassword"
            :placeholder="$getTrans('confirm-password')"
            validate="required"
            v-model.trim="confirmPassword"
            :onBlur="validateField"
            :errors="errors"
            styled="basic"
          />

          <div v-if="authError" class="form-errors" :class="{active: authError}">
            {{ $getTrans(authError) }}
          </div>

          <button>{{ $getTrans('signup') }}</button>
        </form>
        <div class="login-container">
          <span @click="$router.push({name: 'Login'})">
            {{ $getTrans('already-have-an-account') }}
          </span>
        </div>

        <div class="seperator">{{ $getTrans('or') }}</div>

        <div class="auth-providers">
          <google-btn ref="google-btn" @google-success="onGoogleSignup"></google-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {validate, getValidateMsg} from '@/services/errorService.js'
import {userService} from '@/services/userService'

import {mapActions, mapGetters} from 'vuex'

import GoogleBtn from './GoogleBtn.vue'

export default {
  data() {
    return {
      userCred: userService.getEmptyUser(),
      confirmPassword: '',
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
    ...mapActions('auth', ['signup', 'login', 'clearAuthErr']),

    async onSignup({target}) {
      this.errors = validate(target)
      if (this.userCred.password !== this.confirmPassword) {
        this.errors.push(getValidateMsg('CONFIRM_PASSWORD', {name: 'confirmPassword'}))
      }
      if (this.errors.length) return
      await this.signup({userCred: this.userCred})
    },

    async onGoogleSignup(token) {
      const userCred = {
        token,
      }
      await this.login({userCred})
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },
  },

  components: {
    GoogleBtn,
  },
}
</script>
