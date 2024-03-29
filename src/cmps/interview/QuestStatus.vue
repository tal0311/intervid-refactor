<template>
  <section class="quest-status">
    <p v-if="!!formattedTimeLeft">{{ formattedTimeLeft }} / {{ formattedTimeLimit }}</p>
    <div class="progress">
      <div
        class="inner"
        :class="{'half-time': isHalfwayDone, 'no-time': isAlmostDone}"
        :style="{width: timeLeftPercent + '%'}"
      ></div>
    </div>

    <audio ref="timeRun" hidden>
      <source src="@/assets/sounds/time_running.mp3" type="audio/mp3" />
    </audio>
    <audio ref="timeUp" hidden>
      <source src="@/assets/sounds/time_up.mp3" type="audio/mp3" />
    </audio>
  </section>
</template>

<script>
import {formatDuration} from '@/services/i18nService'

export default {
  props: {
    timeLimit: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    isAlmostDone: Boolean,
    isHalfwayDone: Boolean,
  },
  emits: ['time-up', 'halfway-done', 'almost-done'],
  // props: ['timeLimit', 'startTime', 'isAlmostDone', 'isHalfwayDone'],

  timeInterval: null,

  data() {
    return {
      timeLeft: 0,
      isSoundPlayed: false,
      defaultTitle: document.title,
    }
  },

  computed: {
    targetTime() {
      return this.startTime + this.timeLimit * 1000 * 60
    },

    formattedTimeLeft() {
      return formatDuration(this.timeLeft, {noWords: true})
    },

    formattedTimeLimit() {
      return formatDuration(this.timeLimit * 1000 * 60, {noWords: true})
    },

    timeLeftPercent() {
      const timeLimitSecs = this.timeLimit * 1000 * 60
      return Math.round((this.timeLeft / timeLimitSecs) * 100)
    },

    isTimeRunOut() {
      return this.timeLeftPercent < 30
    },
  },

  watch: {
    startTime() {
      document.title = this.defaultTitle
      clearInterval(this.timeInterval)
      this.isSoundPlayed = false
      this.startInterval()
    },
    timeLeftPercent() {
      if (this.timeLeftPercent === 50) {
        this.$emit('halfway-done')
      }
      if (this.timeLeftPercent === 20) {
        this.$emit('almost-done')
      }
    },
  },

  mounted() {
    document.title = this.defaultTitle
    clearInterval(this.timeInterval)
    this.isSoundPlayed = false
    this.startInterval()
  },

  beforeUnmount() {
    document.title = this.defaultTitle
    clearInterval(this.timeInterval)
  },

  methods: {
    startInterval() {
      this.timeInterval = setInterval(() => {
        document.title = this.isTimeRunOut ? this.$getTrans('time-is-running-out') : this.defaultTitle
        this.timeLeft = this.targetTime - Date.now()
        let timeLeftPercent = (this.timeLeft / (this.timeLimit * 1000 * 60)) * 100

        if (timeLeftPercent <= 0) {
          clearInterval(this.timeInterval)
          timeLeftPercent = 0
          this.timeLeft = 0
          this.$refs.timeUp.play()
          this.$emit('time-up')
        } else if (!this.isSoundPlayed && timeLeftPercent < 20) {
          this.$refs.timeRun.play()
          this.isSoundPlayed = true
        }
      }, 500)
    },
  },
}
</script>
