<template>
  <section class="reset-password">
    <h1>{{getTrans('reset-your-password')}}</h1>
    <form class="reset-password-form" @submit.prevent="handleSubmit" autocomplete="off">
      <h2>
        {{getTrans('enter-the-code-we-sent-to')}}
        <p>{{email}}</p>
      </h2>
      <small>{{getTrans('small-msg-about-otp')}}</small>
      <section class="password-inputs">
        <code-digit-input
          v-for="(item, idx) in 6"
          v-model="input[idx]"
          @go-to="goto($event)"
          @paste="paste($event)"
          @remove="remove($event)"
          :idx="idx"
          :disabled="input.length < idx"
          :ref="`digitInput${idx}`"
          :key="item"
        />
      </section>
      <slot></slot>
      <button>{{getTrans('reset-password')}}</button>
    </form>
  </section>
</template>

<script>
import CodeDigitInput from './CodeDigitInput.vue'

export default {
  props: {
    email: String,
  },

  data() {
    return {
      input: [],
    }
  },

  mounted() {
    this.$refs.digitInput0[0].$el.focus()
  },

  unmounted() {
    this.$store.dispatch('auth/clearAuthErr')
  },

  methods: {
    handleSubmit() {
      this.$emit('on-next-step', { enteredCode: this.input.join('') })
    },

    goto(n) {
      if (n < 0 || n >= 6) return

      const el = this.$refs[`digitInput${n}`][0].$el
      el.focus()
    },

    paste(pastedVal) {
      this.input = pastedVal
    },

    remove(idx) {
      if (this.input[+idx]) {
        this.input[idx] = undefined
      } else {
        if (idx === 0) return
        this.input[idx - 1] = undefined
        this.$nextTick(() => {
          this.goto(idx - 1)
        })
      }
      this.$forceUpdate()
    },
  },

  components: { CodeDigitInput },
}
</script>
