<template>
  <section>
    <h1>{{ $getTrans('change-your-password') }}</h1>
    <form class="change-password-form" @submit.prevent="handleSubmit">
      <main-input
        v-model.trim="updated"
        input-name="password"
        :placeholder="$getTrans('new-password')"
        type="password"
        validate="required|password"
        :errors="errors"
        styled="basic"
      />
      <main-input
        v-model.trim="verifyUpdated"
        input-name="confirmPassword"
        :placeholder="$getTrans('confirm-password')"
        type="password"
        validate="required"
        :errors="errors"
        styled="basic"
      />
      <slot></slot>
      <button>{{ $getTrans('change-password') }}</button>
    </form>
  </section>
</template>

<script>
import {validate} from '@/services/errorService'

export default {
  emits: ['on-next-step'],
  data() {
    return {
      updated: '',
      verifyUpdated: '',
      errors: null,
    }
  },

  unmounted() {
    this.$store.dispatch('auth/clearAuthErr')
  },

  methods: {
    handleSubmit({target}) {
      const {updated, verifyUpdated} = this
      this.errors = validate(target)
      if (this.errors.length) return
      if (updated !== verifyUpdated) {
        return this.errors.push({
          msg: 'PASS_NOT_MATCH_VALIDATE',
          elName: 'confirmPassword',
        })
      }
      this.$emit('on-next-step', {updated, verifyUpdated})
    },
  },
}
</script>
