<template>
  <div class="search-box" @click="setFocus(true)" v-click-outside="() => setFocus(false)" :class="{focused: isFocus}">
    <input
      type="search"
      v-model.trim="txt"
      :autofocus="autofocus"
      @focus="isFocus = true"
      :placeholder="$getTrans(placeholder)"
      autocomplete="off"
      results="5"
    />
    <i class="material-icons">search</i>
  </div>
</template>

<script>
import {debounce} from '@/services/utilService'

export default {
  props: ['value', 'autofocus', 'debounce', 'placeholder'],

  data() {
    return {
      isFocus: false,
      txt: '',
    }
  },

  created() {
    this.txt = this.value
    this.createDebounce()
  },

  methods: {
    setFocus(val) {
      this.isFocus = val
    },

    createDebounce() {
      this.debouncedInput = debounce(
        function (newVal) {
          this.$emit('input', 'txt', newVal)
        },
        this.debounce ? 500 : 0,
      )
    },
  },

  watch: {
    txt() {
      if (this.txt === this.value) return
      this.debouncedInput(this.txt)
    },

    debounce() {
      this.createDebounce()
    },

    value() {
      this.txt = this.value
    },
  },
}
</script>
