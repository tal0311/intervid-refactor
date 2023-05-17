<template>
  <div v-click-outside="() => setFocus(false)" class="search-box" :class="{focused: isFocus}" @click="setFocus(true)">
    <!-- Second option, according to ApplicantOverview
    <input
    :value="modelValue"
    :autofocus="autofocus"
    :placeholder="$getTrans(placeholder)"
    @input="onInput($event.target.value)"
    type="search"
    autocomplete="off"
    results="5"
    -->
    <input
      v-model.trim="txt"
      :autofocus="autofocus"
      :placeholder="$getTrans(placeholder)"
      type="search"
      autocomplete="off"
      results="5"
      @focus="setFocus(true)"
    />
    <i class="material-icons">search</i>
  </div>
</template>

<script setup>
import {inject} from 'vue'
import {ref, watch} from 'vue'

const utilService = inject('utilService')

const props = defineProps({
  value: {type: String, default: ''},
  autofocus: {type: Boolean, default: false},
  debounce: {type: Number, default: 0},
  placeholder: {type: String, default: 'search'},
})
const emit = defineEmits(['input'])

const debouncedEmit = utilService.debounce(emit, props.debounce)

// data
const isFocus = ref(false)
const txt = ref(props.value)
// methods
function setFocus(val) {
  isFocus.value = val
}
function onInput(val) {
  if (props.debounce) debouncedEmit('input', 'txt', val)
  else emit('input', 'txt', val)
}

watch(txt, (newTxt) => {
  if (newTxt === props.value) return
  onInput(newTxt)
})
</script>

<!-- Second Option Script -->
<!-- <script setup>
import {ref} from 'vue'
import {useDebouncedEmit} from '@/composables/util/useDeouncedEmit'

const props = defineProps({
  modelValue: {type: String, default: ''},
  autofocus: {type: Boolean, default: false},
  debounce: {type: Number, default: 0},
  placeholder: {type: String, default: 'search'},
})

const emit = defineEmits(['update:modelValue'])

const debouncedEmit = useDebouncedEmit(emit, props.debounce)

const isFocus = ref(false)

function setFocus(val) {
  isFocus.value = val
}

function onInput(newVal) {
  if (props.debounce) debouncedEmit('update:modelValue', newVal)
  else emit('update:modelValue', newVal)
}
</script> -->
<!-- OLD
  <script>
import {useDebouncedEmit} from '@/composables/util/useDeouncedEmit'
import {watch} from 'fs'
export default {
  props: ['value', 'autofocus', 'debounce', 'placeholder'],
  setup(props, {emit}) {
    const {debouncedEmit} = useDebouncedEmit(emit, props.debounce)
    return {
      debouncedEmit,
    }
  },
  data() {
    return {
      isFocus: false,
      txt: '',
    }
  },
  created() {
    this.txt = this.value
    // this.createDebounce()
  },
  methods: {
    setFocus(val) {
      this.isFocus = val
    },
    onInput(val) {
      if (this.debounce) this.this.debouncedEmit('input', 'txt', val)
      else this.$emit('input', 'txt', val)
    },
  },
  watch: {
    txt() {
      if (this.txt === this.value) return
      this.onInput(this.txt)
    },
    // debounce() {
    //   this.createDebounce()
    // },
    value() {
      this.txt = this.value
    },
  },
}
</script> -->
