<template>
  <section class="interview-countdown" v-if="isCounterShown">
    <p>{{ $getTrans('interview-start-in') }}</p>
    <div class="counter"></div>
  </section>
</template>

<script>
export default {
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
