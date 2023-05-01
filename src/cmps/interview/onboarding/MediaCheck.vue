<template>
  <section class="media-check">
    <div class="check-container">
      <div class="video-wrapper">
        <video v-if="!lastRecordedVideo" class="original" autoplay ref="video" playsinline></video>
        <video v-if="!!lastRecordedVideo" ref="recorded-video" playsinline></video>
        <div v-if="!!lastRecordedVideo" :class="{playing: isPlaying}" class="recorded-video-btn-container">
          <i class="material-icons" @click="onPlay">play_arrow</i>
          <p>
            {{ $getTrans('play-the-video-clip-to-see-how-youll-look-and-sound') }}
          </p>

          <div v-if="!!lastRecordedVideo" class="progress">
            <div class="inner" :style="{width: lastRecordedVideoProgress + '%'}"></div>
          </div>
        </div>

        <AudioMeter
          :class="{ready: isAudioReady}"
          v-if="!lastRecordedVideo"
          :stream="videoStream"
          @audio-ready="setAudioStatus"
        />

        <div v-if="currStep === 1" class="face-helper" :class="{success: isFaceReady}" v-html="svgs.faceHelper"></div>
      </div>

      <div class="check-info-container">
        <div :class="{center: isSettingsOpen}" class="settings-info-container">
          <button class="back-btn" @click="isSettingsOpen = false">
            <i class="material-icons">arrow_back_ios</i>
            {{ $getTrans('go-back') }}
          </button>
          <h2>{{ $getTrans('settings') }}</h2>
          <div class="device-select-container">
            <DeviceSelect
              v-if="!!mediaDevice.audio && !!selectedDevice.audio"
              :devices="mediaDevice.audio"
              type="microphone"
              :selected-device-id="selectedDevice.audio"
              @set-device="onSelectDevice"
            />
            <DeviceSelect
              v-if="!!mediaDevice.video && !!selectedDevice.video"
              :devices="mediaDevice.video"
              type="camera"
              :selected-device-id="selectedDevice.video"
              @set-device="onSelectDevice"
            />
          </div>
          <button class="reload-btn" @click="initVideoMixin">
            {{ $getTrans('reload-devices') }}
          </button>
        </div>

        <div
          class="check-info-content step-0"
          :class="{
            center: !isSettingsOpen && currStep === 0,
            left: isSettingsOpen || currStep > 0,
          }"
          v-if="!isLoading"
        >
          <h2>{{ $getTrans('preview-how-you-look-and-sound') }}</h2>
          <p>{{ $getTrans('record-and-play-a-short-video-sample-msg') }}</p>
          <div class="btn-container">
            <button class="main-btn" @click="onNextStep">
              {{ $getTrans('camera-and-audio-check') }}
            </button>
            <button class="link-btn" @click="isSettingsOpen = true">
              {{ $getTrans('update-settings') }}
            </button>
          </div>
        </div>

        <div class="check-info-content media-check-loader" v-else>
          <span>{{ $getTrans('getting-ready-media-check') }}</span>
          <VideoLoader />
        </div>

        <div
          class="check-info-content step-1"
          :class="{
            center: currStep === 1,
            right: currStep < 1,
            left: currStep > 1,
          }"
        >
          <h2>{{ $getTrans('say-something') }}</h2>
          <div>
            <p>{{ $getTrans('for-example') }}</p>
            <p class="bold">
              {{ $getTrans('im-just-testing-my-audio-and-video') }}
            </p>
          </div>
          <div class="timer">
            <div class="progress">
              <div class="inner" :style="{width: (currTime / previewDuration) * 100 + '%'}"></div>
            </div>
            <p>{{ formattedTime.currTime }} / {{ formattedTime.previewDuration }}</p>
          </div>
        </div>

        <div
          class="check-info-content step-2"
          :class="{
            center: currStep === 2 && !selectedError,
            right: currStep < 2,
            left: currStep > 2 || selectedError,
          }"
        >
          <button class="back-btn" @click="resetCheck">
            <i class="material-icons">arrow_back_ios</i>
            {{ $getTrans('go-back') }}
          </button>

          <h2>{{ $getTrans('your-results') }}</h2>

          <p v-if="!isAllReady">
            {{ $getTrans('fix-the-issues-and-then-click-check-again') }}
          </p>

          <div class="device-list">
            <div
              v-if="!!microphoneStatus"
              class="device-preview microphone"
              :class="{
                error: microphoneStatus.isError,
                'non-blocking': microphoneStatus.isError && !microphoneStatus.error.isBlocking,
              }"
              @click="setSelectedError(microphoneStatus.error)"
            >
              <i class="material-icons device">mic</i>
              <div class="device-status">
                <p>{{ $getTrans('microphone') }}</p>
                <p>{{ microphoneStatus.txt }}</p>
              </div>
              <i class="material-icons arrow">chevron_right</i>
            </div>
            <div
              v-if="!!cameraStatus"
              class="device-preview camera"
              :class="{
                error: cameraStatus.isError,
                'non-blocking': cameraStatus.isError && !cameraStatus.error.isBlocking,
              }"
              @click="setSelectedError(cameraStatus.error)"
            >
              <i class="material-icons device">videocam</i>
              <div class="device-status">
                <p>{{ $getTrans('camera') }}</p>
                <p>{{ cameraStatus.txt }}</p>
              </div>
              <i class="material-icons arrow">chevron_right</i>
            </div>
            <div
              v-if="isScreenAns && !!screenStatus"
              class="device-preview camera"
              :class="{
                error: screenStatus.isError,
                'non-blocking': screenStatus.isError && !screenStatus.error.isBlocking,
              }"
              @click="setSelectedError(screenStatus.error)"
            >
              <i class="material-icons device">monitor</i>
              <div class="device-status">
                <p>{{ $getTrans('screen') }}</p>
                <p>{{ screenStatus.txt }}</p>
              </div>
              <i class="material-icons arrow">chevron_right</i>
            </div>
            <div
              v-if="!!connectionStatus"
              class="device-preview connection"
              :class="{
                error: connectionStatus.isError,
                'non-blocking': connectionStatus.isError && !connectionStatus.error.isBlocking,
              }"
              @click="setSelectedError(connectionStatus.error)"
            >
              <i class="material-icons device">wifi</i>
              <div class="device-status">
                <p>{{ $getTrans('connection') }}</p>
                <p>{{ connectionStatus.txt }}</p>
              </div>
              <i class="material-icons arrow">chevron_right</i>
            </div>
          </div>

          <div class="btn-container">
            <button class="link-btn" @click="checkAgain()" :class="{border: !isAllReady}">
              <i class="material-icons">cached</i>
              <span>{{ $getTrans('check-again') }}</span>
            </button>

            <button class="main-btn" @click="$emit('on-next-step')" v-if="isAllReady">
              <!-- <button class="main-btn" @click="$emit('on-next-step')"> -->
              {{ $getTrans('start-interview') }}
            </button>
          </div>
        </div>

        <div class="error-info-container" :class="{center: !!selectedError}">
          <button class="back-btn" @click="selectedError = null">
            <i class="material-icons">arrow_back_ios</i>
            {{ $getTrans('go-back') }}
          </button>
          <div v-if="!!selectedError" class="error-info">
            <p class="error-title" :class="{'non-blocking': !selectedError.isBlocking}">
              <i class="material-icons">{{ errorIcon }}</i>
              {{ $getTrans(`${selectedError.type}_TITLE`) }}
            </p>
            <p class="error-txt">
              {{ $getTrans(`${selectedError.type}_TXT`) }}
            </p>
            <p v-if="selectedError.desc" class="error-desc">
              {{ $getTrans(`${selectedError.type}_DESC${getAdditionTag(selectedError.type)}`) }}
            </p>
          </div>
          <button v-if="selectedError && selectedError.device === 'screen'" class="share-screen" @click="shareScreen">
            {{ $getTrans('share-screen') }}
          </button>
          <DeviceSelect
            v-else-if="
              !!mediaDevice.video && !!selectedDevice.video && !!selectedError && selectedError.device === 'camera'
            "
            :devices="mediaDevice.video"
            type="camera"
            :selected-device-id="selectedDevice.video"
            @set-device="onSelectDevice"
          />
          <DeviceSelect
            v-else-if="
              !!mediaDevice.audio && !!selectedDevice.audio && !!selectedError && selectedError.device === 'microphone'
            "
            :devices="mediaDevice.audio"
            type="microphone"
            :selected-device-id="selectedDevice.audio"
            @set-device="onSelectDevice"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// core
import {ref} from 'vue'
// services
import {screenErrorMap, videoErrorMap, videoErrorTypes} from '@/services/errorService'
import {mediaService} from '@/services/mediaService'
import {faceService} from '@/services/faceService'
import {loggerService} from '@/services/loggerService'
// composables
import {useScreen} from '@/composables/screen/useScreen'
import {useVideo} from '@/composables/video/useVideo'
// cmps
import AudioMeter from '@/cmps/interview/AudioMeter.vue'
import DeviceSelect from '@/cmps/interview/DeviceSelect.vue'
import VideoLoader from '@/cmps/common/VideoLoader.vue'

export default {
  emits: ['on-next-step'],
  setup(props, {emit}) {
    const {screenStream, initScreen, screenErrors} = useScreen()
    const video = ref(null)
    const {
      // SHARED WITH CMP
      isAudioReady,
      selectedError,
      isFaceReady,
      // DATA
      isStreaming,
      isVideoReady,
      videoStream,
      videoDevices,
      audioDevices,
      selectedDevices,
      videoErrors,
      // COMPUTED
      elVideo,
      browser,
      // METHODS
      initVideoMixin,
      stopVideoStream,
      startVideoRecording,
      stopVideoRecording,
      onSelectDevice,
      addVideoError,
      removeVideoError,
      addNetworkListener,
      removeNetworkListener,
      stopMediaRecorder,
      initPreconditions,
      checkNetwork,
    } = useVideo({emit, videoRef: video})
    return {
      screenStream,
      initScreen,
      screenErrors,
      video,
      isAudioReady,
      selectedError,
      isFaceReady,
      isStreaming,
      isVideoReady,
      videoStream,
      videoDevices,
      audioDevices,
      selectedDevices,
      videoErrors,
      elVideo,
      browser,
      initVideoMixin,
      stopVideoStream,
      startVideoRecording,
      stopVideoRecording,
      onSelectDevice,
      addVideoError,
      removeVideoError,
      addNetworkListener,
      removeNetworkListener,
      stopMediaRecorder,
      initPreconditions,
      checkNetwork,
    }
  },
  data() {
    return {
      currStep: 0,
      isRecording: false,
      lastRecordedVideo: null,
      lastRecordedVideoProgress: 0,
      recordingInterval: null,
      currTime: 0,
      previewDuration: 500,
      isSettingsOpen: false,
      isPlaying: false,
      isLoading: true,
      svgs: {faceHelper: ''},
    }
  },

  created() {
    this.svgs.faceHelper = this.$getSvg('faceHelperMediaCheck')
  },

  async mounted() {
    loggerService.info('[onBoarding] [MediaCheck] Mounted')
    await this.initPreconditions()
    await this.initVideoMixin()
    if (this.isScreenAns) this.initScreen()
    this.addNetworkListener()
    await this.initFaceCapture()
  },

  unmounted() {
    if (this._cameraPermission) this._cameraPermission.onchange = null
    if (this._micPermission) this._micPermission.onchange = null
    this.stopVideoStream()
    this.removeNetworkListener()
    loggerService.info('[onBoarding] [MediaCheck] unmounted')
  },

  computed: {
    applicant() {
      return this.$store.getters['applicant/applicant']
    },

    job() {
      return this.$store.getters['applicant/job']
    },

    microphoneStatus() {
      const errs = this.videoErrors.filter((err) => err.device === 'microphone')
      if (errs.length) {
        return {
          txt: this.$getTrans(`${errs[0].type}_TITLE`),
          isError: true,
          error: errs[0],
        }
      } else if (!this.isAudioReady) {
        return {
          txt: this.$getTrans('MIC_LOW_VOLUME_TITLE'),
          isError: true,
          error: videoErrorMap.MIC_LOW_VOLUME,
        }
      } else return {txt: 'OK', isError: false}
    },

    cameraStatus() {
      const errs = this.videoErrors.filter((err) => err.device === 'camera')
      if (errs.length)
        return {
          txt: this.$getTrans(`${errs[0].type}_TITLE`),
          isError: true,
          error: errs[0],
        }
      else if (!this.isFaceReady)
        return {
          txt: this.$getTrans('NOT_RECOGNIZED_TITLE'),
          isError: true,
          error: videoErrorMap.NOT_RECOGNIZED,
        }
      else return {txt: 'OK', isError: false}
    },

    screenStatus() {
      const errs = this.screenErrors.filter((err) => err.device === 'screen')
      if (errs.length) {
        return {
          txt: this.$getTrans(`${errs[0].type}_TITLE`),
          isError: true,
          error: errs[0],
        }
      } else return {txt: 'OK', isError: false}
    },

    connectionStatus() {
      const errs = this.videoErrors.filter((err) => err.device === 'connection')
      if (errs.length)
        return {
          txt: this.$getTrans(`${errs[0].type}_TITLE`),
          isError: true,
          error: errs[0],
        }
      else return {txt: 'OK', isError: false}
    },

    selectedDevice() {
      const {audio, video} = this.selectedDevices
      return {
        audio: audio.deviceId,
        video: video.deviceId,
      }
    },

    mediaDevice() {
      return {
        audio: this.audioDevices,
        video: this.videoDevices,
      }
    },

    blockingErrors() {
      return this.errors.some((err) => err.isBlocking)
    },

    formattedTime() {
      return {
        currTime: `00:0${Math.floor(this.currTime / 100)}`,
        previewDuration: `00:0${Math.floor(this.previewDuration / 100)}`,
      }
    },

    isAllReady() {
      // TODO: make it even better
      const isReady =
        this.isVideoReady && this.isFaceReady && this.isAudioReady && this.isStreaming && !this.blockingErrors
      if (this.isScreenAns) return isReady && !!this.screenStream
      return isReady
      // if (this.isScreenAns)
      //   return (
      //     this.isVideoReady &&
      //     this.isFaceReady &&
      //     this.isAudioReady &&
      //     this.isStreaming &&
      //     !!this.screenStream &&
      //     !this.blockingErrors
      //   )
      // return this.isVideoReady && this.isFaceReady && this.isAudioReady && this.isStreaming && !this.blockingErrors
    },

    isScreenAns() {
      return this.$store.getters['applicant/job'].quests.some((quest) => quest.ansRule.isScreenAns)
    },

    errors() {
      if (this.screenErrors) {
        return [...this.videoErrors, ...this.screenErrors]
      }
      return this.videoErrors
    },

    errorIcon() {
      switch (this.selectedError.device) {
        case 'microphone':
          return 'mic'
        case 'camera':
          return 'videocam'
        case 'connection':
          return 'wifi'
        case 'screen':
          return 'monitor'
        default:
          return 'monitor'
      }
    },
  },

  methods: {
    async initMediaCheck() {
      await this.checkNetwork()
      this.handleFaceCapture()
      this.startVideoRecording()
      this.isRecording = true
      this.setTimer()
    },

    setTimer() {
      this.recordingInterval = setInterval(() => {
        this.currTime++
        if (this.currTime === this.previewDuration) {
          clearInterval(this.recordingInterval)
        }
      }, 10)
    },

    setSelectedError(error) {
      if (!error) return
      this.selectedError = error
    },

    async initFaceCapture() {
      const img = document.createElement('img')
      img.src = '/favicon.ico'
      await this.handleFaceCapture(img, Date.now() + 400)
      this.isLoading = false
    },

    async handleFaceCapture(video = this.$refs.video, time) {
      loggerService.info('[MediaCheck] [handleFaceCapture]')
      try {
        this.isFaceReady = false
        const img = await faceService.getFaceImage(video, time)
        const imgUrl = await mediaService.uploadImg(img)
        const applicant = {
          ...this.applicant,
          info: {
            ...this.applicant.info,
            imgUrl,
          },
        }
        this.$store.commit('applicant/setApplicant', {applicant})
        this.isFaceReady = true
      } catch (err) {
        this.isFaceReady = false
        if (!this.videoErrors.find((error) => videoErrorTypes.includes(error.type))) {
          loggerService.error('[MediaCheck] [handleFaceCapture] Could not capture applicant face', {err})
          // this.addVideoError(videoErrorMap.NOT_RECOGNIZED)
        }
      }
    },

    async shareScreen() {
      loggerService.info('[MediaCheck] [shareScreen]')
      await this.initScreen()
      if (!this.screenStatus.isError) this.selectedError = null
    },

    removeError(error) {
      loggerService.info('[MediaCheck] [removeError]')
      this.removeVideoError(error)
      this.removeScreenError(error)
    },

    async stopMediaCheckRecording() {
      const blob = await this.stopVideoRecording(this.job._id, 'media-check-test')
      this.lastRecordedVideo = blob
      this.isRecording = false
      this.currStep = 2
      this.$nextTick(() => {
        const elVideo = this.$refs['recorded-video']
        if (elVideo) {
          elVideo.removeEventListener('timeupdate', this.updateProgressTime)
          elVideo.addEventListener('timeupdate', this.updateProgressTime)
          elVideo.muted = false
        }
      })
    },

    // TODO: fix this shi*
    updateProgressTime(ev) {
      const lastRecordedVideoProgress = Math.round(((ev.srcElement.currentTime * 100) / this.previewDuration) * 100)
      this.lastRecordedVideoProgress = lastRecordedVideoProgress > 93 ? 100 : lastRecordedVideoProgress
    },

    onNextStep() {
      if (this.currStep === 1 && !this.isRecording) return
      this.currStep++
    },

    async checkAgain() {
      this.isAudioReady = false
      this.isFaceReady = false
      this.lastRecordedVideo = null
      await this.initVideoMixin()
      this.handleFaceCapture()
      if (this.isScreenAns) await this.initScreen()
      this.currStep = 0
      this.currTime = 0
      this.isPlaying = false
      this.onNextStep()
    },

    async resetCheck() {
      this.isAudioReady = false
      this.isFaceReady = false
      this.currStep = 0
      this.isRecording = false
      this.isPlaying = false
      this.lastRecordedVideo = null
      this.recordingInterval = null
      this.currTime = 0
      this.selectedError = null
      await this.initVideoMixin()
    },

    setAudioStatus(isAudioReady) {
      if (this.isAudioReady) return
      this.isAudioReady = isAudioReady
    },

    getAdditionTag(errorType) {
      const browserName = this.browser.name
      const browserAdditionErrors = [videoErrorMap.DENIED_CAM_ACCESS.type, videoErrorMap.DENIED_MIC_ACCESS.type]
      if (browserAdditionErrors.includes(errorType)) {
        const browsers = ['safari', 'chrome', 'firefox', 'edge-chromium']
        if (browsers.includes(browserName)) return '_' + browserName.toUpperCase().replace('-', '_')
      }

      const {os} = this.browser
      const deviceAdditionErrors = [videoErrorMap.MIC_NOT_FOUND.type, videoErrorMap.CAMERA_NOT_FOUND.type]
      const matchedDeviceName = ['mac', 'windows'].find((device) => {
        const regex = new RegExp(device, 'i')
        return 'Mac OS'.match(regex)
      })
      if (deviceAdditionErrors.includes(errorType)) {
        if (matchedDeviceName) return '_' + matchedDeviceName.toUpperCase()
      }

      if (errorType === screenErrorMap.DENIED_SCREEN_ACCESS.type && os === 'Mac OS') {
        return '_' + matchedDeviceName.toUpperCase()
      }
      if (errorType === screenErrorMap.DENIED_SCREEN_ACCESS.type && browserName === 'firefox') {
        return '_' + browserName.toUpperCase()
      }
      return ''
    },

    onPlay() {
      const elVideo = this.$refs['recorded-video']
      elVideo.addEventListener('error', (err) => {
        loggerService.error('[MediaCheck] [onPlay] elVideo error event:', err)
      })
      elVideo.play()
      this.isPlaying = true
      elVideo.onended = () => {
        this.isPlaying = false
        elVideo.onended = null
      }
    },
  },

  watch: {
    lastRecordedVideo() {
      this.$nextTick(() => {
        if (this.lastRecordedVideo) {
          const elRecordedVideo = this.$refs['recorded-video']
          elRecordedVideo.srcObject = null
          elRecordedVideo.src = URL.createObjectURL(this.lastRecordedVideo)
          elRecordedVideo.load()
        }
      })
    },

    currTime(newVal) {
      if (newVal === this.previewDuration) {
        this.currTime = 500
        this.$nextTick(this.onNextStep)
      }
    },

    currStep(newVal) {
      switch (newVal) {
        case 1:
          this.initMediaCheck()
          break
        case 2:
          this.stopMediaCheckRecording()
          break
        default:
          break
      }
    },

    'screenStatus.isError'(newVal) {
      if (!newVal.isError) this.selectedError = null
    },
  },

  components: {
    AudioMeter,
    DeviceSelect,
    VideoLoader,
  },
}
</script>
