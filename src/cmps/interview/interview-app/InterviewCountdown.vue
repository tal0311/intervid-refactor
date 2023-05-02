<template>
  <section v-if="isCounterShown" class="interview-countdown">
    <p>{{ $getTrans('interview-start-in') }}</p>
    <div class="counter"></div>
  </section>
</template>

<script>
export default {
  emits: ['on-next-step'],
  data() {
    return {
      isCounterShown: true,
    }
  },

  mounted() {
    setTimeout(() => {
      this.isCounterShown = false
      this.$emit('on-next-step')
    }, 4000)
  },
}
</script>
