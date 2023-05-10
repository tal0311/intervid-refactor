<template>
  <div
    :class="{
      'main-input': styled === 'main',
      'basic-input': styled === 'basic',
      number: type === 'number',
      textarea: isTextarea,
    }"
  >
    <input
      v-if="!isTextarea"
      :id="inputName"
      ref="password"
      :type="type"
      :name="inputName"
      :placeholder="placeholder || ' '"
      :validate="validate"
      :value="modelValue"
      :min="min"
      :max="max"
      spellcheck="false"
      @input="onChange"
      @blur="onInputBlur"
    />

    <textarea
      v-else
      :id="inputName"
      :type="type"
      :name="inputName"
      :placeholder="placeholder || ' '"
      :validate="validate"
      :value="modelValue || ''"
      :rows="rows"
      spellcheck="false"
      @input="onChange"
      @blur="onInputBlur"
    />

    <label v-if="label" :for="inputName">{{ label }}</label>

    <span v-if="type === 'password'" class="material-icons eye" @click="togglePassword">
      {{ isPasswordShown ? 'visibility_off' : 'visibility' }}
    </span>

    <ValidationMsg v-if="error && isDirty" :error="error" />
  </div>
</template>

<script>
import ValidationMsg from '@/cmps/common/ValidationMsg.vue'

export default {
  components: {ValidationMsg},
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
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
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    rows: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      isDirty: false,
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
    // @OPTION 2: change isDirty to true every time a user enters something, if it isn't already dirty.
    // I like this one a bit better then the watcher one, since this function is called regardless of our addition, but it's still kinda shady.
    onChange(ev) {
      if (!this.isDirty && ev.target.value) this.isDirty = true
      console.log(ev.target.value)
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
