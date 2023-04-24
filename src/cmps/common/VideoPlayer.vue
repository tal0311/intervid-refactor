<template>
  <section ref="playerContainer" class="video-player" :class="{'full-screen': playerState.isFullScreen}">
    <div class="screen-container" :class="{loading: playerState.isLoading}">
      <video ref="mainVideo" @click="togglePlay" @dblclick="toggleFullScreen" :class="mainVideoClass" playsinline>
        Your browser does not support the video tag.
      </video>
    </div>

    <DraggableVideo
      v-show="secVideoSrc && isDraggableShown"
      class="face-container small"
      :class-name="{
        aspect: !playerState.isFullScreen,
        loading: playerState.isLoading,
      }"
      :is-shown="secVideoSrc && isDraggableShown"
    >
      <button class="material-icons" @click="toggleIsDraggableShown">close</button>
      <video ref="secVideo" :src="secVideoSrc" :class="{cover: secVideoName === 'faceUrl'}" playsinline>
        Your browser does not support the video tag.
      </video>
    </DraggableVideo>

    <VideoLoader v-if="playerState.isLoading || isBuffering" />

    <PlayerControls
      :is-buffering="isBuffering"
      :res-time="resTime"
      :notes="notes"
      :is-draggable-shown="isDraggableShown"
      :is-sec-video="!!secVideoSrc"
      :is-playing="isPlaying"
      @set-volume="setVolume"
      @toggle-play="togglePlay"
      @toggle-fullscreen="toggleFullScreen"
      @seek="seekTo"
      @set-speed="onSetSpeed"
      @toggle-is-draggable-shown="toggleIsDraggableShown"
      @toggle-main-video="toggleMainVideo"
      @rotate-main-video="toggleIsMainVideoRotated"
    />

    <button
      class="play-animation"
      :class="{playing: isPlaying, pausing: !isPlaying}"
      v-html="svgs.playPauseAnimation"
    ></button>
  </section>
</template>

<script>
import DraggableVideo from '@/cmps/common/DraggableVideo.vue'
import PlayerControls from '@/cmps/common/PlayerControls.vue'
import VideoLoader from './VideoLoader.vue'

export default {
  components: {PlayerControls, DraggableVideo, VideoLoader},
  props: ['ans', 'notes'],

  data() {
    return {
      isMainVideoWaiting: true,
      isSecVideoWaiting: true,
      isBuffering: false,
      timespans: null,
      currTimespanIdx: 0,
      isDraggableShown: true,
      isMainVideoRotated: false,
      mainVideoName: this.ans?.faceUrl ? 'faceUrl' : 'screenUrl',
      bufferInterval: null,
      svgs: {playPauseAnimation: ''},
    }
  },

  computed: {
    playerState() {
      return this.$store.getters['player/playerState']
    },
    jumpToPoint() {
      return this.$store.getters['player/getJumpToPoint']
    },
    facePos() {
      const {right, top} = this.playerState.facePos
      return {left: right + 'px', top: top + 'px'}
    },

    elMainVideo() {
      return this.$refs.mainVideo
    },

    elSecVideo() {
      return this.$refs.secVideo
    },

    isPlayerReady() {
      const {isLoading, isDisabled} = this.playerState
      return !isLoading && !isDisabled
    },

    secVideoName() {
      return this.mainVideoName === 'faceUrl' ? 'screenUrl' : 'faceUrl'
    },

    mainVideoSrc() {
      if (!this.ans) return ''
      return this.ans[this.mainVideoName]
    },
    mainVideoClass() {
      return {
        cover: this.mainVideoName === 'faceUrl',
        rotated: this.isMainVideoRotated,
      }
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
      const {isPlaying} = this.playerState
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
          this.$store.commit({
            type: 'player/setJumpToPoint',
            jumpToPoint: null,
          })
        }
      },
    },
  },

  created() {
    this.svgs.playPauseAnimation = this.$getSvg('playPauseAnimationIcons')
  },

  async mounted() {
    await this.initVideos()
    this.setPlayerState('isLoading', false)
    document.onfullscreenchange = () => {
      if (!document.fullscreenElement) this.setPlayerState('isFullScreen', false)
    }
  },

  beforeUnmount() {
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
        const {totalDuration} = this.playerState
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
      this.$store.commit({type: 'player/setPlayerState', playerState})
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
      const {isFullScreen} = this.playerState
      if (isFullScreen) document.exitFullscreen()
      else {
        this.$refs.playerContainer.requestFullscreen()
      }
      this.setPlayerState('isFullScreen', !isFullScreen)
    },

    async togglePlay() {
      const {isPlaying, currTime} = this.playerState
      if (!this.isPlayerReady) return
      if (!this.secVideoSrc) this.elSecVideo.pause()
      if (isPlaying) {
        this.elMainVideo.pause()
        if (this.secVideoSrc) this.elSecVideo.pause()
        this.setPlayerState('isPlaying', false)
      } else if (!this.isBuffering) {
        this.elMainVideo.currentTime = currTime
        // console.log('in togglePlay')
        await this.elMainVideo.play()
        if (this.secVideoSrc) {
          this.elMainVideo.currentTime = currTime
          await this.elSecVideo.play()
        }
        this.setPlayerState('isPlaying', true)
      }
    },

    async progressLoop() {
      const {totalDuration} = this.playerState
      const currTime = this.elMainVideo.currentTime
      if (!totalDuration) return
      if (currTime / totalDuration === 1) return

      this.setPlayerState('currTime', currTime)
    },

    async seekTo(seconds, {stopNotes, noteIdx} = {}) {
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
        playerState: {...this.playerState, [key]: value},
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
      this.$store.commit({type: 'player/setPlayerState', playerState})
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
    toggleIsMainVideoRotated() {
      this.isMainVideoRotated = !this.isMainVideoRotated
    },
    toggleIsDraggableShown() {
      this.isDraggableShown = !this.isDraggableShown
    },
  },
}
</script>
