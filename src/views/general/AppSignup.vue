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
            <i class="material-icons"> done </i>
            <span>{{ $getTrans('free-10-video-trial') }}</span>
          </p>
          <p>
            <i class="material-icons"> done </i>
            <span>{{ $getTrans('no-credit-card-required') }}</span>
          </p>
          <p>
            <i class="material-icons"> done </i>
            <span>{{ $getTrans('EasyToUse') }}</span>
          </p>
          <p>
            <i class="material-icons"> done </i>
            <span>{{ $getTrans('recruit-anywhere-with-mobile') }}</span>
          </p>
        </div>
      </div>

      <section class="right-section">
        <div class="form-container">
          <h2>{{ $getTrans('create-your-account') }}</h2>

          <div class="small">
            <p>{{ $getTrans('get-10-video-for-free') }}</p>
            <p>{{ $getTrans('no-credit-card-required') }}</p>
          </div>
          <form novalidate @submit.prevent="onSignup">
            <div class="input-container">
              <MainInput
                v-model.trim="userCred.fName"
                type="text"
                input-name="fName"
                :placeholder="$getTrans('first-name')"
                validate="required"
                :on-blur="validateField"
                :errors="errors"
                styled="basic"
              />
              <MainInput
                v-model.trim="userCred.lName"
                type="text"
                input-name="lName"
                :placeholder="$getTrans('last-name')"
                validate="required"
                :on-blur="validateField"
                :errors="errors"
                styled="basic"
              />
            </div>

            <MainInput
              v-model.trim="userCred.email"
              type="email"
              input-name="email"
              :placeholder="$getTrans('email')"
              validate="required|email"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
            />

            <MainInput
              v-model.trim="userCred.password"
              type="password"
              input-name="password"
              :placeholder="$getTrans('password') + ' ' + $getTrans('at-least-6-char')"
              validate="required|password"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
              autocomplete="new-password"
            />
            <MainInput
              v-model.trim="confirmPassword"
              type="password"
              input-name="confirmPassword"
              :placeholder="$getTrans('confirm-password')"
              validate="required"
              :on-blur="validateField"
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
            <GoogleBtn ref="google-btn" @google-success="onGoogleSignup"></GoogleBtn>
          </div>
        </div>
        <div class="apps-badges hidden">
          <img src="../../assets/icons/app-store-badge.png" alt="app-store-badge" />
          <img src="../../assets/icons/google-play-badge.png" alt="google-play-badge" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import {validate, getValidateMsg} from '@/services/errorService.js'
import {userService} from '@/services/userService'

import {mapActions, mapGetters} from 'vuex'

import GoogleBtn from './GoogleBtn.vue'

export default {
  components: {
    GoogleBtn,
  },
  data() {
    return {
      userCred: userService.getEmptyUser(),
      confirmPassword: '',
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
}
</script>
