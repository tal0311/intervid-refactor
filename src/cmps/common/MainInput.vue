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
      :id="inputName"
      ref="password"
      :type="$attrs.type || 'text'"
      :name="inputName"
      :placeholder="placeholder || ' '"
      :validate="validate"
      :value="$attrs.modelValue"
      :min="$attrs.min"
      :max="$attrs.max"
      spellcheck="false"
      @input="onChange"
      @blur="onInputBlur"
    />

    <textarea
      v-else
      :id="inputName"
      :type="$attrs.type || 'text'"
      :name="inputName"
      :placeholder="placeholder || ' '"
      :validate="validate"
      :value="$attrs.modelValue || ''"
      :rows="$attrs.rows"
      spellcheck="false"
      @input="onChange"
      @blur="onInputBlur"
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
  components: {ValidationMsg},
  inheritAttrs: false,
  props: {
    inputName: {
      type: String,
      required: true,
    },
    validate: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    errors: {
      type: Array,
      default: () => [],
    },
    isTextarea: {
      type: Boolean,
      default: false,
    },
    styled: {
      type: String,
      default: 'main',
    },
    placeholder: {
      type: String,
      default: '',
    },
    onBlur: {
      type: Function,
      default: null,
    },
  },
  emits: ['update:modelValue', 'change'],
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
}
</script>
