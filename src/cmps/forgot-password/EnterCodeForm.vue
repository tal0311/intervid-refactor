<template>
  <section class="enter-code">
    <h1>{{ $getTrans('enter-code') }}</h1>
    <form class="enter-code-form" @submit.prevent="handleSubmit">
      <h2>
        {{ $getTrans('enter-the-code-we-sent-to') }}
        <p>{{ email }}</p>
      </h2>
      <small>{{ $getTrans('small-msg-about-otp') }}</small>
      <section class="password-inputs">
        <CodeDigitInput
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
      <button>{{ $getTrans('login') }}</button>
    </form>
  </section>
</template>

<script>
import CodeDigitInput from './CodeDigitInput.vue'

export default {
  props: {
    email: {
      type: String,
      required: true,
    },
  },
  emits: ['on-next-step'],

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
      this.$emit('on-next-step', {enteredCode: this.input.join('')})
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

  components: {CodeDigitInput},
}
</script>
