<template>
  <div class="mobile-lng-modal mobile-modal-content">
    <button @click="setLang('en')">English</button>
    <button @click="setLang('he')">עברית</button>
  </div>
</template>

<script>
export default {
  emits: ['on-close'],
  methods: {
    setLang(lang) {
      this.$emit('on-close')
      this.$store.dispatch('app/setLang', {lang})
    },
  },
}
</script>
