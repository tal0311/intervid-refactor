<template>
  <div class="app-help" @click="openModal">
    <span class="material-symbols-outlined"> sms_failed </span>
  </div>
</template>

<script >
export default {
  methods: {
    openModal() {
      this.$store.dispatch('app/toggleModal', {type: 'UserFeedback'})
    },
  },
}
</script>

<style lang="scss" scoped>
.app-help {
  position: fixed;
  inset-block-end: 0.2em;
  inset-inline-start: 0.2em;
  cursor: pointer;
}
</style>