<template>
  <section class="interview" ref="interview" v-if="currQuest">
    <div class="interview-content">
      <quest-countdown v-if="isCountdown" @show-quest="showQuest" :currQuest="currQuest" />

      <video-recorder
        ref="vidRecorder"
        v-else-if="(isVidAns || isScreenAns) && !lastRecordedVideo"
        :maxTryNum="1"
        :showControl="false"
        :currQuest="currQuest"
        :isRecording="isRecording"
        :stream="videoStream"
        :errors="errors"
        :isScreenAns="isScreenAns"
        :isAlmostDone="isAlmostDone"
        @reload="reload"
        @remove-error="removeError($event)"
      />

      <div class="video-wrapper" v-if="lastRecordedVideo">
        <video controls ref="vidPlayer" class="retake-video" playsinline></video>
      </div>

      <section
        class="right"
        :class="{
          'with-desc': currQuest.desc,
          'with-text-ans': currQuest.ansRule.isTxtAns,
        }"
      >
        <div class="top">
          <quest-status
            v-if="!lastRecordedVideo && isRecording"
            ref="questStatus"
            :startTime="startTime"
            :timeLimit="currQuest.timeLimit"
            :isAlmostDone="isAlmostDone"
            :isHalfwayDone="isHalfwayDone"
            @time-up="onTimeUp"
            @setTimeLeft="timeLeft = $event"
            @halfway-done="isHalfwayDone = true"
            @almost-done="isAlmostDone = true"
          />

          <div class="quest-num">
            {{ $getTrans('question') }} {{ currQuestIdx + 1 }} {{ $getTrans('of') }} {{ this.job.quests.length }}
          </div>
        </div>

        <div class="bottom" v-if="currQuest.txt">
          <h4>{{ currQuest.txt }}</h4>
          <p class="quest-desc html-container" ref="questDesc" v-html="currQuest.desc"></p>
        </div>

        <!-- <text-ans v-if="currQuest.ansRule.isTxtAns" :txt="currAns.txt" @save-ans="setAns" /> -->
        <div class="btn-container">
          <button v-if="!isRecording && isAllowRetake" class="main-btn" @click="onStartRecording">
            {{ $getTrans('start-recording') }}
          </button>
          <button
            v-if="isAllowRetake && isRecording"
            v-show="!isCountdown"
            :class="[{disabled: !isMinTimePassed && !lastRecordedVideo}, btnClass]"
            :disabled="!isMinTimePassed && !lastRecordedVideo"
            @click="lastRecordedVideo ? retakeQuest() : onFinishQuest()"
          >
            {{ lastRecordedVideo ? $getTrans('retake-question') : $getTrans('stop-recording') }}
          </button>
          <button
            v-if="!isAllowRetake || lastRecordedVideo"
            v-show="!isCountdown"
            class="main-btn"
            :class="{disabled: !isMinTimePassed && !lastRecordedVideo}"
            :disabled="!isMinTimePassed && !lastRecordedVideo"
            @click="isAlmostDone ? onFinishQuest(true) : toggleConfirmation()"
          >
            {{ isLastQuest ? $getTrans('finish-interview') : $getTrans('save-and-proceed') }}
          </button>
        </div>
      </section>
    </div>

    <div class="screen" v-if="isConfirmationShown">
      <div class="confirmation-modal">
        <div class="confirmation-dialogue">
          <i class="material-icons">warning_amber</i>
          <div>
            <p>{{ $getTrans('continue-to-next-question-title') }}</p>
            <p>{{ $getTrans('you-have-time-to-answer') }}</p>
          </div>
        </div>
        <div class="btns">
          <button @click="toggleConfirmation()" data-ans="no">
            {{ $getTrans('stay-on-current-question') }}
          </button>
          <button @click="onFinishQuest(true)">
            {{ $getTrans('yes-im-sure') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// core
import {ref} from 'vue'
// services
import {templateService} from '@/services/templateService'
import {uploaderService} from '@/services/uploaderService'
import {timelineService} from '@/services/timelineService'
import {screenErrorMap} from '@/services/errorService'
import {loggerService} from '@/services/loggerService'
// composables
import {useScreen} from '@/composables/screen/useScreen'
import {useVideo} from '@/composables/video/useVideo'
// cmps
import VideoRecorder from '@/cmps/common/VideoRecorder.vue'
import QuestStatus from '@/cmps/interview/QuestStatus.vue'
import QuestCountdown from '@/cmps/interview/interview-app/QuestCountdown.vue'

// import TextAns from '@/cmps/interview/TextAns.vue'

export default {
  setup(props, {emit}) {
    const vidRecorder = ref(null)
    const {
      initScreen,
      screenErrors,
      startScreenRecording,
      stopScreenRecorder,
      stopScreenRecording,
      disposeScreenStream,
      removeScreenError,
    } = useScreen({vidRecorder})

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
    } = useVideo({emit, videoRecorderRef: vidRecorder})
    return {
      initScreen,
      screenErrors,
      startScreenRecording,
      stopScreenRecorder,
      stopScreenRecording,
      disposeScreenStream,
      removeScreenError,
      vidRecorder,
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
    }
  },
  data() {
    return {
      timeLeft: 100,
      isMinTimePassed: false,
      currQuestIdx: 0,
      startTime: null,
      lastRecordedVideo: null,
      isRecording: false,
      isHalfwayDone: false,
      isAlmostDone: false,
      isConfirmationShown: false,
      isCountdown: null,
    }
  },

  async mounted() {
    this.isCountdown = !this.isAllowRetake
    if (this.isAllowRetake) await this.startInterview()
    this.addApplicant()
    window.onbeforeunload = (ev) => {
      loggerService.info('[Interview] [onBeforeUnload] Applicant try to leave the interview - open confirmation modal')
      this.$utilService.verifyBeforeExit(ev)
    } // Open confirmation modal
    document.body.onunload = () => {
      loggerService.info('[Interview] [onunload] Applicant try to leave the interview - send quit timeEvent')
      this.$emit('handle-quit')
    } // Send quit timeEvent when navigated out (all case exept interview inner routes navigation)

    this.initPreconditions()
    this.addNetworkListener()
    loggerService.info(`[Interview] [mounted] - Applicant has started the Interview proccess`)

    uploaderService.addEventListener('progress', (progress) => {
      if (progress === 100) {
        loggerService.info(`[Interview] [progress] - upload progress = 100`)
        this.$store.commit({
          type: 'applicant/setIsUploadDone',
          isUploadDone: true,
        })
      }
    })
  },

  beforeUnmount() {
    if (!this.isInterviewDone) {
      this.$emit('handle-quit')
    } // Send quit timeEvent when navigated out (only interview inner routes navigation)
    window.onbeforeunload = null
    document.body.onunload = null
  },

  unmounted() {
    if (this._cameraPermission) this._cameraPermission.onchange = null
    if (this._micPermission) this._micPermission.onchange = null
    this.stopVideoStream()
  },

  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },

    currQuest() {
      return this.job.quests[this.currQuestIdx]
    },

    currAns() {
      return this.applicant?.answerMap[this.currQuest.id] || templateService.createAns()
    },

    applicant() {
      return this.$store.getters['applicant/applicant']
    },

    isLastQuest() {
      return this.currQuestIdx === this.job.quests.length - 1
    },

    isInterviewDone() {
      return this.currQuestIdx === this.job.quests.length
    },

    isVidAns() {
      return this.currQuest?.ansRule.isVidAns
    },

    isScreenAns() {
      return this.currQuest?.ansRule.isScreenAns
    },

    // logoUrl() {
    //   return (
    //     this.job.company.logoUrl ||
    //     'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
    //   )
    // },

    errors() {
      if (this.screenErrors) {
        return [...this.videoErrors, ...this.screenErrors]
      }
      return this.videoErrors
    },

    blockingErrors() {
      return this.errors.some((err) => err.isBlocking)
    },

    isUploadDone() {
      return this.$store.getters['applicant/isUploadDone']
    },

    btnClass() {
      return this.lastRecordedVideo ? 'secondary-btn' : 'main-btn'
    },

    isAllowRetake() {
      return !this.job.rule.isOneTry
    },
  },

  methods: {
    async startInterview() {
      if (this.isVidAns || this.isScreenAns) this.initRecorders()
      if (!this.isAllowRetake) {
        this.isRecording = true
        this.resetTimers()
      }
      loggerService.info(
        `[interview-app] [Interview] [startInterview] Applicant: ${this.applicant.id} started interview successfully`,
      )
    },

    async showQuest() {
      this.isCountdown = false
      if (this.currQuestIdx === 0) await this.startInterview()
      else {
        this.resetTimers()
        this.isRecording = true
        await this.initRecorders()
      }
    },

    resetTimers() {
      loggerService.info('[Interview] [resetTimers]')
      this.setMinTime()
      this.startTime = Date.now()
    },

    async initRecorders() {
      loggerService.info('[Interview] [initRecorders]')
      await this.initVideoMixin()
      if (!this.isAllowRetake) this.startVideoRecording()
      // console.log('this.isScreenAns', this.isScreenAns)
      if (!this.isScreenAns) return
      await this.initScreen()
      this.startScreenRecording()
    },

    async onStartRecording() {
      loggerService.info('[Interview] [onStartRecording]')
      this.isRecording = true
      this.resetTimers()
      this.startVideoRecording()
      if (!this.isScreenAns) return
      this.startScreenRecording()
    },

    async onFinishQuest(isApproved) {
      loggerService.info(`[Interview] [onFinishQuest] QuestId: ${this.currQuest.id}`)
      if (this.isConfirmationShown) {
        this.toggleConfirmation()
      }
      if (!this.lastRecordedVideo) {
        /***/ loggerService.info('[Interview] [onFinishQuest] no lastRecodedVideo')
        const videoBlob = await this.getRecordedVideo()
        /***/ loggerService.info('[Interview] [onFinishQuest] videoBlob', videoBlob)
        this.lastRecordedVideo = videoBlob
      }
      if (!this.isAllowRetake || isApproved) {
        this.onNextQuest()
      }
    },

    async retakeQuest() {
      loggerService.info(`[Interview] [retakeQuest] QuestId: ${this.currQuest.id}`)
      this.setMinTime()
      this.isHalfwayDone = false
      this.isAlmostDone = false
      this.isRecording = false
      this.lastRecordedVideo = null
      await this.initRecorders()
    },

    toggleConfirmation() {
      this.isConfirmationShown = !this.isConfirmationShown
    },

    async onNextQuest() {
      loggerService.info('[Interview] [onNextQuest]')
      const name = `${this.applicant.id}-${this.job._id}-${this.currQuest.id}-`
      if (this.isVidAns || this.isScreenAns) {
        this.uploadVideo(name, this.lastRecordedVideo)
      }
      if (this.isScreenAns) this.uploadScreen(name)
      this.$store.commit({
        type: 'applicant/setIsUploadDone',
        isUploadDone: false,
      })
      this.lastRecordedVideo = null
      this.isRecording = false
      this.isHalfwayDone = false
      this.isAlmostDone = false
      this.nextQuest()
    },

    nextQuest() {
      loggerService.info('[Interview] [nextQuest]')
      this.currQuestIdx++
      this.resetTimers()
      if (this.isInterviewDone) {
        loggerService.info('[Interview] [nextQuest] Interview is done')
        this.disposeScreenStream()
        this.$router.push({path: 'end'})
        return
      }
      if (this.isVidAns || this.isScreenAns) {
        if (!this.isAllowRetake) {
          // this.isRecording = true
          this.isCountdown = true
        } else this.initRecorders()
      }
    },

    onTimeUp() {
      loggerService.info(`[Interview] [onTimeUp] QuestId: ${this.currQuest.id}`)
      this.onFinishQuest()
    },

    async getRecordedVideo() {
      try {
        loggerService.info('[Interview] [getRecordedVideo]')
        return await this.stopVideoRecording(this.job._id, this.currQuest.id)
      } catch (err) {
        loggerService.error('[Interview] [getRecordedVideo] Couldnt get recorded video', this.applicant, err)
      }
    },

    async uploadVideo(name, videoBlob) {
      try {
        loggerService.info(`[Interview] [uploadVideo] Video name: ${name}`)
        name += 'face'
        uploaderService.uploadFile(videoBlob, name)
      } catch (err) {
        loggerService.error(
          '[Interview] [uploadVideo] Problem when getting data from video recorder',
          this.applicant,
          err,
        )
      }
    },

    async uploadScreen(name) {
      try {
        loggerService.info(`[Interview] [uploadScreen] Video name: ${name}`)
        name += 'screen'
        const screenBlob = await this.stopScreenRecording(this.job._id, this.currQuest.id)
        uploaderService.uploadFile(screenBlob, name)
      } catch (err) {
        loggerService.error(
          '[Interview] [uploadScreen] Problem when getting data from screen recorder',
          this.applicant,
          err,
        )
      }
    },

    // set the minimum time (in seconds) until the candidate can move on to the next question
    setMinTime() {
      this.isMinTimePassed = false
      setTimeout(() => (this.isMinTimePassed = true), 6000)
    },

    setAns({key, value}) {
      const applicant = {
        ...this.applicant,
        answerMap: {
          ...this.applicant.answerMap,
          [this.currQuest.id]: {...this.currAns, [key]: value},
        },
      }
      loggerService.info('[Interview] [setAns] applicant: ', {applicant})
      this.saveApplicant(applicant)
    },

    addApplicant() {
      loggerService.info('[Interview] [addApplicant]')
      const timeEvent = timelineService.activityEvent('opened')
      const applicantToAdd = {
        ...this.applicant,
        timestamp: {...this.applicant.timestamp, opened: Date.now()},
        timeline: [...this.applicant.timeline, timeEvent],
      }
      this.$store.dispatch('applicant/addApplicant', {
        applicant: applicantToAdd,
      })
    },

    removeError(error) {
      this.removeVideoError(error)
      this.removeScreenError(error)
    },

    async reload() {
      loggerService.info('[Interview] [reload]')
      this.screenErrors = []
      await this.initRecorders()
    },
  },

  watch: {
    lastRecordedVideo: {
      handler() {
        this.$nextTick(() => {
          if (this.lastRecordedVideo) {
            const elVidPlayer = this.$refs.vidPlayer
            elVidPlayer.srcObject = null
            elVidPlayer.src = URL.createObjectURL(this.lastRecordedVideo)
            elVidPlayer.load()
          }
        })
      },
    },
    currQuestIdx: {
      handler() {
        this.$nextTick(() => {
          if (this.$refs.questDesc) this.$refs.questDesc.scroll(0, 0)
        })
      },
    },

    blockingErrors: {
      async handler(currErrors, prevErrors) {
        // If there is at least 1 error, stop the recordings
        if (currErrors.length) {
          this.stopMediaRecorder()
          this.stopScreenRecorder()
        } else if (prevErrors.length) {
          // If the error was this specific type, reload() happens so we don't need to initRecorders() again
          if (prevErrors.some((err) => err.type === screenErrorMap.DENIED_SCREEN_ACCESS.type)) return
          await this.initRecorders()
        }
      },
    },
  },

  components: {
    VideoRecorder,
    QuestStatus,
    QuestCountdown,
    // TextAns,
  },
}
</script>
