<template>
  <section class="reset-password">
    <h1>{{ $getTrans('reset-your-password') }}</h1>
    <form class="reset-password-form" autocomplete="off" @submit.prevent="handleSubmit">
      <h2>
        {{ $getTrans('enter-the-code-we-sent-to') }}
        <p>{{ email }}</p>
      </h2>
      <small>{{ $getTrans('small-msg-about-otp') }}</small>
      <section class="password-inputs">
        <CodeDigitInput
          v-for="(item, idx) in 6"
          :ref="`digitInput${idx}`"
          :key="item"
          v-model="input[idx]"
          :idx="idx"
          :disabled="input.length < idx"
          @go-to="goto($event)"
          @paste-input="paste($event)"
          @remove="remove($event)"
        />
      </section>
      <slot></slot>
      <button>{{ $getTrans('reset-password') }}</button>
    </form>
  </section>
</template>

<script>
import {nextTick} from 'vue'
import CodeDigitInput from './CodeDigitInput.vue'

export default {
  components: {CodeDigitInput},
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
        nextTick(() => {
          this.goto(idx - 1)
        })
      }
      // See https://stackoverflow.com/questions/67469326/this-forceupdate-equivalent-in-vue-3-composition-api
      this.$forceUpdate()
    },
  },
}
</script>
