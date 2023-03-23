<template>
  <section class="interview-end">
    <template v-if="!isUploadDone">
      <div class="upload">
        <uploading-animation />
        <div class="content">
          <div class="progress-bar">
            <span>{{ donePercent + '%' }}</span>
            <div :style="{width: donePercent + '%'}" class="inner"></div>
          </div>
          <div class="uploading-msg">
            <p>{{ $getTrans('do-not-close-this-window') }}</p>
            <p>{{ $getTrans('your-inteview-recordings-uploaded') }}</p>
          </div>
        </div>

        <div class="modal-wrapper" v-if="waitForNetwork">
          <div class="no-network-modal">
            <div class="head-container">
              <i class="material-icons"> wifi_off </i>
              <p>{{ $getTrans('no-internet-connection') }}</p>
            </div>
            <p>{{ $getTrans('make-sure-wifi-connected') }}</p>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="goodbye">
        <div class="content">
          <h1>{{ $getTrans('thanks') }}</h1>
          <p>{{ $getTrans('your-application-has-been-successfully-sent') }}</p>
          <p>{{ $getTrans('well-be-in-touch-with-you-as-soon-as-possible') }}</p>
        </div>
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1661183431/Frontend/interview-end_b82dmk.png"
          alt="interview-end"
        />
      </div>

      <application-index />

      <confetti-animation />
    </template>
  </section>
</template>

<script>
// services
import {uploaderService} from '@/services/uploaderService'
import {loggerService} from '@/services/loggerService'
// composables
import {useVideo} from '@/composables/video/useVideo'
// cmps
import UploadingAnimation from '@/cmps/common/UploadingAnimation.vue'
import ApplicationIndex from '../onboarding/ApplicationIndex.vue'
import ConfettiAnimation from '@/cmps/common/ConfettiAnimation.vue'

export default {
  emits: ['handle-quit'],
  setup(props, {emit}) {
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
    } = useVideo({emit})

    return {
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
    }
  },

  data() {
    return {
      donePercent: 0,
    }
  },

  mounted() {
    window.onbeforeunload = (ev) => {
      loggerService.info(
        '[InterviewEnd] [onBeforeUnload] Applicant try to leave the interview - open confirmation modal',
      )
      this.$verifyBeforeExit(ev)
    } // Open confirmation modal
    document.body.onunload = () => {
      if (!this.isUploadDone) {
        loggerService.info('[InterviewEnd] [onunload] Applicant try to leave the interview - send quit timeEvent')
        this.$emit('handle-quit')
      }
    } // Send quit timeEvent when navigated out (all case exept interview inner routes navigation)

    uploaderService.addEventListener('progress', (progress) => {
      this.donePercent = progress
      if (progress === 100) {
        loggerService.info(`[InterviewEnd] [progress] - upload progress = 100`)
        this.$store.commit({
          type: 'applicant/setIsUploadDone',
          isUploadDone: true,
        })
      }
    })

    this.addNetworkListener()
  },

  beforeUnmount() {
    if (!this.isUploadDone) {
      this.$emit('handle-quit')
    } // Send quit timeEvent when navigated out (only interview inner routes navigation)
    window.onbeforeunload = null
    document.body.onunload = null
    this.removeNetworkListener()
  },

  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },

    waitForNetwork() {
      return this.$store.getters['applicant/waitForNetwork']
    },

    isUploadDone() {
      return this.$store.getters['applicant/isUploadDone']
    },
  },

  methods: {},

  components: {UploadingAnimation, ApplicationIndex, ConfettiAnimation},
}
</script>
