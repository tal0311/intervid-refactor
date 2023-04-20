<template>
  <div
    :class="{
      'main-input': styled === 'main',
      'basic-input': styled === 'basic',
      number: $attrs.type === 'number',
      textarea: isTextarea,
    }"
  >
    <input
      v-if="!isTextarea"
      :type="$attrs.type || 'text'"
      :id="inputName"
      :name="inputName"
      :placeholder="placeholder || ' '"
      @input="onChange"
      :validate="validate"
      :value="$attrs.modelValue"
      :min="$attrs.min"
      :max="$attrs.max"
      @blur="onInputBlur"
      ref="password"
      spellcheck="false"
    />

    <textarea
      v-else
      :type="$attrs.type || 'text'"
      :id="inputName"
      :name="inputName"
      :placeholder="placeholder || ' '"
      @input="onChange"
      :validate="validate"
      :value="$attrs.modelValue || ''"
      :rows="$attrs.rows"
      @blur="onInputBlur"
      spellcheck="false"
    />

    <label v-if="label" :for="inputName">{{ label }}</label>

    <span v-if="$attrs.type === 'password'" class="material-icons eye" @click="togglePassword">
      {{ isPasswordShown ? 'visibility_off' : 'visibility' }}
    </span>

    <ValidationMsg :error="error" />
  </div>
</template>

<script>
import ValidationMsg from '@/cmps/common/ValidationMsg.vue'

export default {
  props: ['inputName', 'validate', 'label', 'errors', 'isTextarea', 'styled', 'placeholder', 'onBlur'],
  inheritAttrs: false,
  data() {
    return {
      isPasswordShown: false,
    }
  },
  computed: {
    error() {
      if (!Array.isArray(this.errors)) return null
      const err = this.errors.find((err) => err.elName === this.inputName) || {}
      return err.msg
    },

    onInputBlur() {
      return this.onBlur || this.onChange
    },
  },

  methods: {
    onChange(ev) {
      this.$emit('update:modelValue', ev.target.value)
      this.$emit('change', ev)
    },

    togglePassword() {
      this.$refs.password.type = this.$refs.password.type === 'password' ? 'text' : 'password'
      this.isPasswordShown = !this.isPasswordShown
    },
  },

  components: {ValidationMsg},
}
</script>
