<template>
  <section>
    <h1>{{getTrans('change-your-password')}}</h1>
    <form class="change-password-form" @submit.prevent="handleSubmit">
      <main-input
        inputName="password"
        :placeholder="getTrans('new-password')"
        type="password"
        validate="required|password"
        v-model.trim="updated"
        :errors="errors"
        styled="basic"
      />
      <main-input
        inputName="confirmPassword"
        :placeholder="getTrans('confirm-password')"
        type="password"
        validate="required"
        v-model.trim="verifyUpdated"
        :errors="errors"
        styled="basic"
      />
      <slot></slot>
      <button>{{getTrans('change-password')}}</button>
    </form>
  </section>
</template>

<script>
import { validate } from '@/services/errorService'

export default {
  data() {
    return {
      updated: '',
      verifyUpdated: '',
      errors: null,
    }
  },

  destroyed() {
    this.$store.dispatch('auth/clearAuthErr')
  },

  methods: {
    handleSubmit({ target }) {
      const { updated, verifyUpdated } = this
      this.errors = validate(target)
      if (this.errors.length) return
      if (updated !== verifyUpdated) {
        return this.errors.push({
          msg: 'PASS_NOT_MATCH_VALIDATE',
          elName: 'confirmPassword',
        })
      }
      this.$emit('on-next-step', { updated, verifyUpdated })
    },
  },
}
</script>
