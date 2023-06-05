<template>
  <section class="player-controls" :class="{pause: !isPlaying}">
    <div class="progressbar-wrapper">
      <div class="progress-bar">
        <input type="range" class="video-progress" min="0" max="100" :value="videoProgress" @input="onSeek" />
        <div class="progress-color" :style="{width: videoProgress + '%'}"></div>
        <div class="buffering-color" :style="{width: downloadProgress + '%'}"></div>
      </div>
    </div>

    <div class="btn-container">
      <div class="controls">
        <button class="play" :disabled="!isPlayerReady" @click="$emit('toggle-play')">
          <i class="material-icons top-right-player-tooltip" :data-tooltip="$getTrans('pause-video')">{{
            playerState.isPlaying ? 'pause' : 'play_arrow'
          }}</i>
        </button>

        <div class="volume">
          <i :data-tooltip="$getTrans('volume')" class="material-icons top-player-tooltip" @click="toggleMute">{{
            volumeIcon
          }}</i>
          <input
            type="range"
            class="volume-input"
            :value="playerState.volume * 100"
            min="0"
            max="100"
            @input="onSetVolume"
          />
        </div>

        <span class="total-time">{{ formattedCurrTime }} / {{ formattedTotalDuration }}</span>
      </div>

      <div class="settings-container">
        <div class="speed-container">
          <button class="setting-btn speed-btn" @click="toggleSpeedModal">
            <i :data-tooltip="$getTrans('speed')" class="material-icons top-player-tooltip">speed</i>
          </button>

          <div class="speed-modal" :class="{open: isSpeedOpen}">
            <p
              v-for="(speedStr, idx) in speedStrs"
              :key="idx"
              class="speed-item"
              :class="{selected: isSelectedSpeed(speedStr)}"
              @click="onSetSpeed(speedStr)"
            >
              {{ speedStr }}
            </p>
          </div>
        </div>

        <button
          v-if="!isDraggableShown && isSecVideo"
          class="setting-btn draggable-btn"
          @click="$emit('toggle-is-draggable-shown')"
        >
          <i :data-tooltip="$getTrans('add-screen')" class="material-icons top-player-tooltip">desktop_windows</i>
        </button>

        <button
          v-if="isDraggableShown && isSecVideo"
          class="setting-btn switch-btn"
          @click="$emit('toggle-main-video')"
        >
          <i :data-tooltip="$getTrans('switch-screen')" class="material-icons top-player-tooltip">cameraswitch</i>
        </button>

        <button class="setting-btn rotate-btn" @click="$emit('rotate-main-video')">
          <i :data-tooltip="$getTrans('rotate-screen')" class="material-icons top-player-tooltip">rotate_right</i>
        </button>

        <button class="setting-btn fullscreen-btn" @click="$emit('toggle-fullscreen')">
          <i :data-tooltip="$getTrans('full-screen')" class="material-icons top-left-player-tooltip">{{
            playerState.isFullScreen ? 'fullscreen' : 'fullscreen_exit'
          }}</i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    isBuffering: {
      type: Boolean,
      required: true,
    },
    resTime: {
      type: Object,
      default: null,
    },
    isDraggableShown: {
      type: Boolean,
      required: true,
    },
    isSecVideo: {
      type: Boolean,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'toggle-play',
    'toggle-is-draggable-shown',
    'toggle-main-video',
    'rotate-main-video',
    'toggle-fullscreen',
    'set-speed',
    'seek',
    'set-volume',
  ],

  data() {
    return {
      isSpeedOpen: false,
      speedStrs: ['0.5', '0.75', 'Normal', '1.25', '1.5', '2'],
    }
  },

  computed: {
    playerState() {
      return this.$store.getters['player/playerState']
    },

    formattedTotalDuration() {
      return this.$utilService.secondsToTime(this.playerState.totalDuration)
    },

    formattedCurrTime() {
      return this.$utilService.secondsToTime(this.playerState.currTime)
    },

    isPlayerReady() {
      const {isLoading, isDisabled} = this.playerState
      return !isLoading && !isDisabled
    },

    playerSpeed() {
      const playerSpeed = this.$store.getters['player/playerState'].speed
      if (playerSpeed === 1) return 'Normal'
      return playerSpeed
    },

    downloadProgress() {
      return this.playerState.downloadProgress
    },

    volumeIcon() {
      if (this.playerState.volume > 0.8) return 'volume_up'
      else if (this.playerState.volume <= 0.8 && this.playerState.volume > 0.1) return 'volume_down'
      else return 'volume_off'
    },

    videoProgress() {
      return (this.playerState.currTime / this.playerState.totalDuration) * 100
    },
  },

  methods: {
    isSelectedSpeed(speedStr) {
      const {speed} = this.playerState
      return speedStr === 'Normal' ? speed === 1 : speed + '' === speedStr
    },

    onSetSpeed(speed) {
      this.isSpeedOpen = false
      const parsedSpeed = speed === 'Normal' ? 1 : parseFloat(speed)
      this.$emit('set-speed', parsedSpeed)
    },

    onSeek({target}) {
      if (!this.isPlayerReady) return
      const seconds = (this.playerState.totalDuration / 100) * target.value
      this.$emit('seek', seconds, {stopNotes: true})
    },

    onSetVolume({target}) {
      this.$emit('set-volume', target.value / 100)
    },

    toggleMute() {
      const volume = this.playerState.volume > 0 ? 0 : 1
      this.$emit('set-volume', volume)
    },

    toggleSpeedModal() {
      this.isSpeedOpen = !this.isSpeedOpen
    },
  },
}
</script>
