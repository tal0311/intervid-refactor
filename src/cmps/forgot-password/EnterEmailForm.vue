<template>
  <section>
    <h1>{{ $getTrans('forgot-password') }}</h1>
    <form @submit.prevent="handleSubmit" class="enter-email-form">
      <h2>{{ $getTrans('enter-email-address') }}</h2>
      <main-input
        type="email"
        inputName="email"
        :placeholder="$getTrans('email')"
        validate="required||email"
        v-model.trim="email"
        :onBlur="validateField"
        :errors="errors"
        styled="main"
      />

      <div class="set-option-container">
        <label>
          <input type="radio" value="RMP" name="set_option" v-model="setOption" required />
          <span>{{ $getTrans('reset-my-password') }}</span>
        </label>
        <label>
          <input type="radio" value="OTP" name="set_option" v-model="setOption" required />
          <span>{{ $getTrans('send-otp') }}</span>
        </label>
      </div>
      <slot></slot>
      <button>{{ $getTrans('continue') }}</button>
    </form>
  </section>
</template>

<script>
import {validate} from '@/services/errorService'

export default {
  data() {
    return {
      email: '',
      setOption: 'RMP',
      errors: null,
    }
  },

  unmounted() {
    this.$store.dispatch('auth/clearAuthErr')
  },

  methods: {
    handleSubmit({target}) {
      this.errors = validate(target)
      if (this.errors.length) return
      this.$emit('on-next-step', {
        email: this.email,
        setOption: this.setOption,
      })
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },
  },
}
</script>
