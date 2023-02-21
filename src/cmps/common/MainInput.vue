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
      :value="$attrs.value"
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
      :value="$attrs.value || ''"
      :rows="$attrs.rows"
      @blur="onInputBlur"
      spellcheck="false"
    />

    <label v-if="label" :for="inputName">{{ label }}</label>

    <span v-if="$attrs.type === 'password'" class="material-icons eye" @click="togglePassword">
      {{ isPasswordShown ? 'visibility_off' : 'visibility' }}
    </span>

    <validation-msg :error="error" />
  </div>
</template>

<script>
import ValidationMsg from '@/cmps/common/ValidationMsg.vue'

export default {
  props: ['inputName', 'validate', 'label', 'errors', 'isTextarea', 'styled', 'placeholder', 'onBlur'],

  data() {
    return {
      isPasswordShown: false,
    }
  },

  computed: {
    error() {
      return this.errors?.find((err) => err.elName === this.inputName)?.msg
    },

    onInputBlur() {
      return this.onBlur || this.onChange
    },
  },

  methods: {
    onChange(ev) {
      this.$emit('input', ev.target.value)
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
