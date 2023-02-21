<template>
  <div class="time-up">
    <h3 class="title">{{ getTrans('you-ran-out-of-time') }}</h3>
    <p>
      {{ getTrans('moving-on-in') }}
      <span>{{ secondsLeft }} {{ getTrans('seconds') }}</span>
    </p>
    <button class="material-btn blue" @click="onNextQuest">
      {{ getTrans('next-question') }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['data'],

  timeInterval: null,

  data() {
    return {
      timeLeft: this.data.secondsToWait,
      startTime: Date.now(),
    }
  },

  mounted() {
    if (document.visibilityState !== 'visible') {
      document.addEventListener('visibilitychange', this.handleBackToTab)
    } else {
      this.startCountdown()
    }
  },

  unmounted() {
    document.removeEventListener('visibilitychange', this.handleBackToTab)
  },

  computed: {
    secondsLeft() {
      return Math.ceil(this.timeLeft / 1000)
    },

    targetTime() {
      return this.data.secondsToWait * 1000 + this.startTime
    },
  },

  methods: {
    startCountdown() {
      this.timeInterval = setInterval(() => {
        this.timeLeft = this.targetTime - Date.now()
        if (this.timeLeft <= 0) {
          this.onNextQuest()
        }
      }, 200)
    },

    onNextQuest() {
      clearInterval(this.timeInterval)
      this.timeInterval = null
      this.data.actionFnc()
      this.$emit('close')
    },

    handleBackToTab() {
      document.removeEventListener('visibilitychange', this.handleBackToTab)
      this.startTime = Date.now()
      if (document.visibilityState === 'visible') this.startCountdown()
    },
  },
}
</script>
