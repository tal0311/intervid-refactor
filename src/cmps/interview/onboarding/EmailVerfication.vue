<template>
  <section class="email-verify-step">
    <div class="content">
      <h1>We have sent a code to your email address, please enter it below</h1>
      <MainInput
        v-model.trim="code"
        input-name="code"
        type="text"
        validate="required"
        :on-blur="validateField"
        aria-placeholder="Enter code"
        :errors="errors"
        styled="basic"
      />
    </div>
    <button @click="verifyCode">{{ btnMsgs[currStep] }}</button>
    <p>(Interview will not yet start)</p>
  </section>
</template>

<script>
import {validate} from '@/services/errorService'

export default {
  props: {
    btnMsgs: {
      type: Array,
      required: true,
    },
    currStep: {
      type: Number,
      required: true,
    },
  },
  emits: ['login'],
  data() {
    return {
      isVerifying: false,
      code: '',
      errors: null,
    }
  },

  methods: {
    async verifyCode({target}) {
      this.errors = validate(target)
      if (this.errors.length) return
      try {
        this.isVerifying = true
        // await userService.verifyApplicant(this.applicant.id, this.code)
        this.$emit('login', this.applicant)
      } catch (err) {
        // TODO: get error from server
        this.errors.push({
          msg: 'INVALID_VERIFY_CODE_ERR',
          elName: 'code',
        })
      } finally {
        this.isVerifying = false
      }
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },
  },
}
</script>
