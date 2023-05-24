<template>
  <div class="audio-meter">
    <div ref="meter" class="inner" :style="{height: displayVolume + '%'}">
      <div class="yellow"></div>
      <div class="green"></div>
      <div class="red"></div>
    </div>
  </div>
</template>

<script>
import {createAudioMeter} from '@/services/audioMeterService'

export default {
  props: {
    stream: {
      type: Object,
      default: null,
    },
  },
  emits: ['audio-ready'],
  data() {
    return {
      intervalId: null,
      isAudio: false,
      noAudioTimeout: null,
      MIN_VOLUME: 0.10,
      displayVolume: 0,
    }
  },

  watch: {
    stream() {
      this.cleanMeter()
      this.getAudioLevel()
    },
  },

  mounted() {
    this.getAudioLevel()
  },

  beforeUnmount() {
    this.cleanMeter()
  },

  methods: {
    cleanMeter() {
      if (!this.meter) return
      this.meter.shutdown()
      window.cancelAnimationFrame(this.intervalId)
      if (this.noAudioTimeout) clearTimeout(this.noAudioTimeout)
    },

    drawAudioLoop() {
      this.displayVolume = this.meter.volume * 1.5 * 100
      if (this.meter.volume > this.MIN_VOLUME) {
        this.isAudio = true
        this.$emit('audio-ready', this.isAudio)
      }
      this.intervalId = window.requestAnimationFrame(this.drawAudioLoop)
    },

    verifyNoAudio() {
      if (this.noAudioTimeout) return
      this.noAudioTimeout = setTimeout(() => {
        this.isAudio = !(!this.isAudio && this.meter.volume < this.MIN_VOLUME)
        this.$emit('audio-ready', this.isAudio)
        this.noAudioTimeout = null
      }, 500)
    },

    getAudioLevel() {
      var audioContext = new AudioContext()
      if (!this.stream?.getAudioTracks().length) return
      var microphone = audioContext.createMediaStreamSource(this.stream)
      this.meter = createAudioMeter(audioContext, 0.85)
      microphone.connect(this.meter)
      this.drawAudioLoop()
    },
  },
}
</script>
