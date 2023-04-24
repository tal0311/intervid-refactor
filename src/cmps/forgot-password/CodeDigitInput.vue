<template>
  <input
    type="number"
    :value="modelValue"
    :disabled="$attrs.disabled"
    name="code-digit"
    autocomplete="nope"
    @keydown="type"
    @paste.prevent="paste"
    @keydown.left.right="moveInput"
    @keydown.delete="$emit('remove', idx)"
  />
</template>

<script>
import {nextTick} from 'vue'
export default {
  props: ['idx', 'modelValue'],

  methods: {
    type(event) {
      const key = event.key.replace(/\D/g, '')
      if (key) {
        event.preventDefault()
        this.$emit('update:modelValue', key)
        console.log(key)
        nextTick(() => {
          this.$emit('go-to', this.idx + 1)
        })
      } else if (!event.ctrlKey) {
        event.preventDefault()
      }
    },

    paste(event) {
      let pastedVal = event.clipboardData.getData('text')
      pastedVal = pastedVal.replace(/\D/g, '').substring(0, this.length).split('')
      if (pastedVal) {
        console.log('pastedVal', pastedVal)
        this.$emit('paste-new-val', pastedVal)
      }
    },

    moveInput(event) {
      const diff = event.keyCode === 37 ? -1 : 1
      this.$emit('go-to', this.idx + diff)
    },
  },
}
</script>
