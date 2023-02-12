<template>
  <section ref="playerContainer" class="video-player" :class="{ 'full-screen': playerState.isFullScreen }">
    <div class="screen-container" :class="{ loading: playerState.isLoading }">
      <video
        :src="mainVideoSrc"
        ref="mainVideo"
        @click="togglePlay"
        @dblclick="toggleFullScreen"
        :class="{ cover: mainVideoName === 'faceUrl' }"
        playsinline
        
      >
        Your browser does not support the video tag.
      </video>
    </div>

    <draggable-video class="face-container small" :className="{
      aspect: !playerState.isFullScreen,
      loading: playerState.isLoading,
    }" :isShown="secVideoSrc && isDraggableShown" v-show="secVideoSrc && isDraggableShown">
      <button class="material-icons" @click="toggleIsDraggableShown">close</button>
      <video :src="secVideoSrc" :class="{ cover: secVideoName === 'faceUrl' }" ref="secVideo"  playsinline>
        Your browser does not support the video tag.
      </video>
    </draggable-video>

    <video-loader v-if="playerState.isLoading || isBuffering" />

    <player-controls
      :isBuffering="isBuffering"
      :resTime="resTime"
      :notes="notes"
      :isDraggableShown="isDraggableShown"
      :isSecVideo="!!secVideoSrc"
      :isPlaying="isPlaying"
      @set-volume="setVolume"
      @toggle-play="togglePlay"
      @toggle-fullscreen="toggleFullScreen"
      @seek="seekTo"
      @set-speed="onSetSpeed"
      @toggle-is-draggable-shown="toggleIsDraggableShown"
      @toggle-main-video="toggleMainVideo"
    />

    <button class="play-animation" :class="{ playing: isPlaying, pausing: !isPlaying }">
      <svg class="play" width="76" height="77" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 38.5V72.0279C0 75.0014 3.12925 76.9354 5.78885 75.6056L72.8446 42.0777C75.7928 40.6036 75.7928 36.3964 72.8446 34.9223L5.78886 1.39443C3.12926 0.064628 0 1.99861 0 4.97214V38.5Z"
          fill="white" />
      </svg>
      <svg class="pause" width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" width="20" height="80" rx="4" fill="white" />
        <rect width="20" height="80" rx="4" fill="white" />
      </svg>
    </button>
  </section>
</template>

<script>
import DraggableVideo from '@/cmps/common/DraggableVideo.vue'
import PlayerControls from '@/cmps/common/PlayerControls.vue'
import VideoLoader from './VideoLoader.vue'

export default {
  props: ['ans', 'notes'],

  data() {
    return {
      isMainVideoWaiting: true,
      isSecVideoWaiting: true,
      isBuffering: false,
      timespans: null,
      currTimespanIdx: 0,
      isDraggableShown: true,
      mainVideoName: this.ans?.faceUrl ? 'faceUrl' : 'screenUrl',
      bufferInterval: null,
    }
  },

  async mounted() {
    await this.initVideos()
    this.setPlayerState('isLoading', false)
    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) this.setPlayerState('isFullScreen', false)
    }
  },

  beforeDestroy() {
    document.onfullscreenchange = null
    const elVideos = this.getElVideos()
    elVideos.forEach((elVideo) => {
      elVideo.pause()
      elVideo.removeAttribute('src')
      elVideo.load()
    })
    this.resetPlayer()
    this.elMainVideo.removeEventListener('timeupdate', this.progressLoop)
    this.elMainVideo.removeEventListener('ended', this.onEnd)
    clearInterval(this.bufferInterval)
    this.bufferInterval = null
  },

  computed: {
    playerState() {
      return this.$store.getters['player/playerState']
    },
    jumpToPoint() {
      return this.$store.getters['player/getJumpToPoint']
    },
    facePos() {
      const { right, top } = this.playerState.facePos
      return { left: right + 'px', top: top + 'px' }
    },

    elMainVideo() {
      return this.$refs.mainVideo
    },

    elSecVideo() {
      return this.$refs.secVideo
    },

    isPlayerReady() {
      const { isLoading, isDisabled } = this.playerState
      return !isLoading && !isDisabled
    },

    secVideoName() {
      return this.mainVideoName === 'faceUrl' ? 'screenUrl' : 'faceUrl'
    },

    mainVideoSrc() {
      if (!this.ans) return ''
      return this.ans[this.mainVideoName]
    },

    secVideoSrc() {
      if (!this.ans) return ''
      return this.ans[this.secVideoName]
    },

    isPlaying() {
      return this.playerState.isPlaying
    },
    resTime() {
      if (!this.ans) return ''
      return this.ans.resTime
    },
  },
  methods: {
    initVideos() {
      this.elMainVideo.addEventListener('timeupdate', this.progressLoop)
      this.elMainVideo.addEventListener('ended', this.onEnd)
      this.addBufferListeners()
      const elVideos = this.getElVideos()
      const videosPrms = elVideos.map((elVideo) => {
        return new Promise((resVid) => {
          elVideo.onloadedmetadata = () => {
            const totalDuration = elVideo.duration === Infinity && this.resTime ? this.resTime / 1000 : elVideo.duration
            this.setPlayerState('totalDuration', totalDuration)
            resVid()
          }
        })
      })
      return Promise.all(videosPrms)
    },

    addBufferListeners() {
      this.elMainVideo.onwaiting = () => {
        this.isMainVideoWaiting = true
        this.isBuffering = true
      }
      this.elMainVideo.oncanplaythrough = () => {
        this.isMainVideoWaiting = false
        if (!this.secVideoSrc || !this.isSecVideoWaiting) this.isBuffering = false
      }
      this.elSecVideo.onwaiting = () => {
        this.isSecVideoWaiting = true
        this.isBuffering = true
      }
      this.elSecVideo.oncanplaythrough = () => {
        this.isSecVideoWaiting = false
        if (!this.isMainVideoWaiting) this.isBuffering = false
      }
      if (this.bufferInterval) clearInterval(this.bufferInterval)
      this.bufferInterval = setInterval(() => {
        const { totalDuration } = this.playerState
        const mainVideoBufferedLength = this.elMainVideo.buffered.length
        if (!mainVideoBufferedLength) return
        const mainVideoProgress = this.elMainVideo.buffered.end(mainVideoBufferedLength - 1)
        let progress = mainVideoProgress
        if (this.secVideoSrc) {
          const secVideoBufferedLength = this.elSecVideo.buffered.length
          if (!secVideoBufferedLength) return
          const secVideoProgress = this.elSecVideo.buffered.end(secVideoBufferedLength - 1)
          if (mainVideoProgress > secVideoProgress) {
            progress = secVideoProgress
          }
        }
        let downloadProgress = (progress * 100) / totalDuration
        if (downloadProgress >= 99) {
          downloadProgress = 100
          clearInterval(this.bufferInterval)
          this.bufferInterval = null
        }
        this.setPlayerState('downloadProgress', downloadProgress)
      }, 1000)
    },

    handleNoVideo() {
      const playerState = {
        ...this.playerState,
        // isLoading: false,
        isPlaying: false,
        isDisabled: true,
      }
      this.$store.commit({ type: 'player/setPlayerState', playerState })
    },

    onEnd() {
      this.setPlayerState('currTime', this.playerState.totalDuration)
      if (this.totalDuration) {
        this.setPlayerState('isPlaying', false)
      }
    },

    getElVideos() {
      const elVideos = []
      if (this.mainVideoSrc) elVideos.push(this.elMainVideo)
      if (this.secVideoSrc) elVideos.push(this.elSecVideo)
      return elVideos
    },

    setVolume(volume) {
      this.setPlayerState('volume', volume)
      this.elMainVideo.volume = volume
      if (this.elSecVideo) this.elSecVideo.volume = volume
    },

    onSetSpeed(speed) {
      this.setPlayerState('speed', speed)
      this.handleSpeedChange()
    },

    handleSpeedChange() {
      const elVideos = this.getElVideos()
      elVideos.forEach((elVideo) => {
        elVideo.playbackRate = this.playerState.speed
      })
    },

    toggleFullScreen() {
      const { isFullScreen } = this.playerState
      if (isFullScreen) document.exitFullscreen()
      else {
        this.$refs.playerContainer.requestFullscreen()
      }
      this.setPlayerState('isFullScreen', !isFullScreen)
    },

    async togglePlay() {
      const { isPlaying, currTime } = this.playerState
      if (!this.isPlayerReady) return
      if (!this.secVideoSrc) this.elSecVideo.pause()
      if (isPlaying) {
        this.elMainVideo.pause()
        if (this.secVideoSrc) this.elSecVideo.pause()
        this.setPlayerState('isPlaying', false)
      } else if (!this.isBuffering) {
        this.elMainVideo.currentTime = currTime
        console.log('in togglePlay')
        await this.elMainVideo.play()
        if (this.secVideoSrc) {
          this.elMainVideo.currentTime = currTime
          await this.elSecVideo.play()
        }
        this.setPlayerState('isPlaying', true)
      }
    },

    async progressLoop() {
      console.log('progLoop')
      const { totalDuration } = this.playerState
      const currTime = this.elMainVideo.currentTime
      if (!totalDuration) return
      if (currTime / totalDuration === 1) return

      this.setPlayerState('currTime', currTime)
    },

    async seekTo(seconds, { stopNotes, noteIdx } = {}) {
      if (stopNotes) this.setPlayerState('isPlayingNotes', false)
      if (noteIdx !== undefined) this.currTimespanIdx = noteIdx
      this.isBuffering = true
      this.isSecVideoWaiting = true
      this.isSecVideoWaiting = true
      this.setPlayerState('currTime', seconds)
      const elVideos = this.getElVideos()

      const videosPrms = elVideos.map((elVideo) => {
        return new Promise((resVid) => {
          elVideo.pause()
          elVideo.currentTime = seconds
          elVideo.onseeked = () => {
            resVid()
          }
        })
      })
      await Promise.all(videosPrms)
      this.isBuffering = false
      this.togglePlay()

      return Promise.resolve()
    },

    setPlayerState(key, value) {
      this.$store.commit({
        type: 'player/setPlayerState',
        playerState: { ...this.playerState, [key]: value },
      })
    },

    resetPlayer() {
      const playerState = {
        ...this.playerState,
        isPlaying: false,
        isLoading: true,
        totalDuration: 0,
        currTime: 0,
        isPlayingNotes: false,
        isDisabled: false,
      }
      this.$store.commit({ type: 'player/setPlayerState', playerState })
    },

    toggleMainVideo() {
      const currTime = this.elMainVideo.currentTime
      this.setPlayerState('isPlaying', false)
      this.mainVideoName = this.secVideoName
      this.$nextTick(() => {
        this.elSecVideo.currentTime = currTime
        this.elMainVideo.currentTime = currTime
        this.setPlayerState('currTime', currTime)
        // this.setPlayerState('isPlaying', false)
        this.togglePlay()
      })
    },

    toggleIsDraggableShown() {
      this.isDraggableShown = !this.isDraggableShown
    },
  },

  watch: {
    ans(to, from) {
      if (!this.ans || (!to?.faceUrl && !to?.screenUrl)) {
        return
      }
      if (to?.faceUrl && to?.screenUrl) {
        this.mainVideoName = 'screenUrl'
      } else if (!to?.screenUrl) {
        this.mainVideoName = 'faceUrl'
      } else if (!to?.faceUrl) {
        this.mainVideoName = 'screenUrl'
      }
      if (from?.screenUrl && !from?.faceUrl) {
        this.elSecVideo.removeEventListener('timeupdate', this.progressLoop)
        this.elSecVideo.removeEventListener('ended', this.onEnd)
      }
      if (from?.faceUrl !== to?.faceUrl) {
        this.resetPlayer()
      }
      this.$nextTick(async () => {
        await this.initVideos()
        this.setPlayerState('isLoading', false)
        this.handleSpeedChange()
        this.togglePlay()
      })
    },

    isBuffering() {
      const { isPlaying } = this.playerState
      if (this.isBuffering && isPlaying) {
        this.togglePlay()
      } else if (!this.isBuffering && !isPlaying) {
        this.togglePlay()
      }
    },

    jumpToPoint: {
      handler(timePoint) {
        if (timePoint) {
          this.seekTo(timePoint)
          this.$store.commit({ type: 'player/setJumpToPoint', jumpToPoint: null })
        }
      },
    }

  },

  components: { PlayerControls, DraggableVideo, VideoLoader },
}
</script>
