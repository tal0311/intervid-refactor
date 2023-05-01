<template>
  <section class="quest-countdown">
    <span>{{ $getTrans('recording-start-in') }}</span>
    <div class="counter">{{ counter }}</div>
    <span
      >{{ $getTrans('time-limit-for-answer') }}: {{ currQuest.timeLimit }}
      {{ currQuest.timeLimit > 1 ? $getTrans('minutes') : $getTrans('minute') }}</span
    >
  </section>
</template>

<script>
export default {
  props: {
    currQuest: {
      type: Object,
      required: true,
    },
  },
  emits: ['show-quest'],
  data() {
    return {
      counter: 10,
    }
  },

  mounted() {
    this.intervalId = setInterval(() => {
      if (this.counter === 1) {
        this.$emit('show-quest')
        clearInterval(this.intervalId)
        return
      }
      this.counter--
    }, 1000)
  },
}
</script>
