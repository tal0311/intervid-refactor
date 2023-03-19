<template>
  <main class="main-app interview-app">
    <header v-if="!!job">
      <div class="header-content container">
        <div class="logo-container">
          <img
            loading="lazy"
            src="https://res.cloudinary.com/intervid/image/upload/v1661181884/Frontend/logo-color_kftsor.png"
            alt="logo"
          />
          <lng-menu />
        </div>
        <div class="btn-container">
          <div class="job-info">
            <p>{{ job.company.name }}</p>
            <p>{{ jobTitle }}</p>
          </div>
          <img v-if="!isFirstPage" loading="lazy" :src="logoUrl" alt="company-logo" />
        </div>
      </div>
    </header>

    <interview-error v-if="interviewErr" :interviewErr="interviewErr" />

    <div v-else-if="!!job" class="interview-app-content">
      <RouterView @handle-quit="handleQuit" />
    </div>
    <app-modal />
  </main>
</template>

<script>
import {mapMutations} from 'vuex'
import {uploaderService} from '@/services/uploaderService'
import {timelineService} from '@/services/timelineService'
import {browserErrorMap} from '@/services/errorService'
import {getEmitData, socketService, SOCKET_EMIT_DONE_INTERVIEW} from '@/services/socketService'
import {loggerService} from '@/services/loggerService'
import {supportedBrowsersMap, defaultImgUrl} from '@/services/constData'

import InterviewError from '@/cmps/interview/InterviewError.vue'
import AppModal from '@/cmps/common/AppModal.vue'
import LngMenu from '@/cmps/common/LngMenu.vue'
import config from '@/config'

export default {
  data() {
    return {
      updatePrms: [],
      MAX_TRY_COUNT: 2,
      isInterview: false,
      failedFiles: [],
      totallyFailedfiles: [],
    }
  },

  async created() {
    this.checkPrerequisites()
    this.initInterview()
    socketService.setup()
  },

  mounted() {
    // console.log('mounted')
    if (this.$route.query.demo) this.$store.commit({type: 'applicant/setIsPreview', isPreview: true})
  },

  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },

    applicant() {
      return this.$store.getters['applicant/applicant']
    },

    jobTitle() {
      if (!this.job?.info?.title) return ''
      return this.job.info.title
    },

    interviewErr() {
      return this.$store.getters['applicant/interviewErr']
    },

    fileRetryMap() {
      return this.$store.getters['applicant/fileRetryMap']
    },

    logoUrl() {
      return (
        this.job.company.logoUrl ||
        'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
      )
    },

    isHeaderShown() {
      return this.$route.name === 'Interview'
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isMobileDevice() {
      return this.$store.getters['app/isMobileDevice']
    },

    isLngOpen() {
      return this.modal.type === 'lng'
    },

    isScreenInterview() {
      return this.job?.quests.some((quest) => quest.ansRule.isScreenAns)
    },

    totlaAssetsCount() {
      return this.job.quests.reduce((sum, quest) => {
        sum += quest.ansRule.isScreenAns ? 2 : 1
        return sum
      }, 0)
    },

    isFirstPage() {
      return this.$store.getters['applicant/isInvitationPage']
    },

    waitForNetwork() {
      return this.$store.getters['applicant/waitForNetwork']
    },

    browser() {
      return this.$store.getters['app/browser']
    },

    isBrowserSupported() {
      const {name} = this.browser
      return !!supportedBrowsersMap[name]
    },

    isBrowserVersionSupported() {
      const {name, os} = this.browser
      if (os === 'iOS') {
        const agent = window.navigator.userAgent
        const start = agent.indexOf('OS ')
        const iosVersion = Number(agent.substring(start + 3, 3).replace('_', '.'))
        const supportedIosVersion = supportedBrowsersMap[name]
        return iosVersion >= supportedIosVersion
      }
      const userBrowserVersion = +this.browser.version.split('.')[0]
      const supportedBrowserVersion = supportedBrowsersMap[name]
      return userBrowserVersion >= supportedBrowserVersion
    },
  },

  methods: {
    ...mapMutations('applicant', ['setInterviewErr', 'addFileRetry']),

    async initInterview() {
      this.updatePrms = []
      this.initUploader()
      await this.loadJob()
      if (!this.job) return this.setInterviewErr({type: 'INTERVIEW_NOT_FOUND'})
      this.loadApplicant()
      this.setMeta()
    },
    setMeta() {
      const meta = {
        metaTags: [
          {
            property: 'og:title',
            content: `${this?.job.info.title} | ${this?.job.company.name}`,
          },
          {
            property: 'og:description',
            content: `${this?.job.info.desc || 'Join us!'}`,
          },
          {
            property: 'og:image',
            content: this?.job.info.coverUrl || defaultImgUrl.jobCover,
          },
        ],
      }

      const head = document.head
      meta.metaTags.forEach((tag) => {
        const element = document.createElement('meta')

        Object.keys(tag).forEach((key) => {
          element.setAttribute(key, tag[key])
        })

        head.appendChild(element)
      })
    },
    async loadJob() {
      const {jobId} = this.$route.params
      await this.$store.dispatch('applicant/loadJob', {jobId})
      if (this.isScreenInterview && this.isMobileDevice) {
        this.setInterviewErr({type: 'NO_MOBILE_SCREEN_SHARE'})
      }
    },

    async loadApplicant() {
      const {applicantId} = this.$route.params
      await this.$store.dispatch('applicant/loadApplicant', {applicantId})
      loggerService.info(
        `[InterviewApp] [loadApplicant] ${applicantId ? 'Applicant loaded - ' + applicantId : 'New applicant created'}`,
      )
    },

    updateApplicant(applicant) {
      loggerService.info('[InterviewApp] [updateApplicant] Applicant updated', {
        applicant,
      })
      return this.$store.dispatch('applicant/updateApplicant', {applicant})
    },

    checkPrerequisites() {
      const {name, version} = this.browser
      if (!this.isBrowserSupported) {
        loggerService.error('User browser is not supported', name)
        this.setInterviewErr(browserErrorMap.NO_BROWSER_SUPPORT)
      } else if (!this.isBrowserVersionSupported) {
        loggerService.error('User browser version is not supported', version)
        this.setInterviewErr(browserErrorMap.NO_VERSION_SUPPORT)
      }
    },

    initUploader() {
      uploaderService.initVideoUpload()
      uploaderService.addEventListener('upload-success', this.onUploadSuccess)
      uploaderService.addEventListener('upload-error', this.onUploadError)
    },

    onUploadSuccess(file) {
      loggerService.info('[InterviewApp] [onUploadSuccess] file uploaded successfully', {file})
      const fileKey = `${this.job._id}/${file.meta.name}`
      this.saveAsset(fileKey, file.data.interviewData)
      this.failedFiles = this.failedFiles.filter((fileId) => file.id !== fileId)
      if (this.totlaAssetsCount - this.totallyFailedfiles.length === this.updatePrms.length) {
        loggerService.info(`[InterviewApp] [onUploadSuccess] Last asset finished uploading`)
        this.doneInterview()
      }
    },

    onUploadError(file, err) {
      const fileId = file.id
      const retryCount = this.fileRetryMap[fileId] || 0
      this.failedFiles.push(fileId)
      loggerService.info('[InterviewApp] [onUploadError] failed to upload file - retryCount: ' + retryCount, {
        file,
        err,
      })
      if (err.isAxiosError) {
        loggerService.info('[InterviewApp] [onUploadError] Axios error', {
          err,
        })
        if (!navigator.onLine) {
          this.$store.commit('applicant/setWaitForNetwork', {
            waitForNetwork: true,
          })
          loggerService.info('[InterviewApp] [onUploadError] Axios error - network error', {err})
          return uploaderService.handleNetworkError(fileId)
        }
      }
      if (retryCount >= this.MAX_TRY_COUNT) {
        this.failedFiles = this.failedFiles.filter((id) => fileId !== id)
        this.totallyFailedfiles.push(fileId)
        loggerService.info(
          `[InterviewApp] [onUploadError] Stopped retry for file ID: ${fileId}. retryCount: ${retryCount}`,
        )
        if (this.totlaAssetsCount - this.totallyFailedfiles.length === this.updatePrms.length) {
          loggerService.info(`[InterviewApp] [onUploadError] Last asset finished uploading`)
          this.doneInterview()
        }
        return
      }
      setTimeout(() => {
        loggerService.info(
          `[InterviewApp] [onUploadError] Retrying file upload, retryCount: ${retryCount}, fileId: ${fileId}`,
        )
        uploaderService.retryUpload(fileId)
        this.addFileRetry({fileId})
      }, 1000 * retryCount)
    },

    saveAsset(fileKey, {isScreen, questId}) {
      const ans = {...this.applicant.answerMap[questId]}
      ans[isScreen ? 'screenKey' : 'faceKey'] = fileKey
      loggerService.info(
        `[InterviewApp] [saveAsset] Saving ${
          isScreen ? 'screen' : 'face'
        } video key: ${fileKey} for questId: ${questId}`,
      )
      const applicant = {
        ...this.applicant,
        answerMap: {...this.applicant.answerMap, [questId]: ans},
      }
      const prm = this.updateApplicant(applicant)
      this.updatePrms.push(prm)
    },

    setLang(lang) {
      this.toggleLngModal()
      this.$store.dispatch('app/setLang', {lang})
    },

    toggleLngModal() {
      this.$store.dispatch('app/toggleModal', {type: 'lng'})
    },

    async doneInterview() {
      try {
        loggerService.info(
          `[InterviewApp] [doneInterview] All assets finished uploading tries:\n
            totlaAssetsCount: ${this.totlaAssetsCount},\n
            updatePrms.length: ${this.updatePrms.length}\n
            totallyFailedfiles.length: ${this.totallyFailedfiles.length}\n
            `,
        )
        if (this.totallyFailedfiles.length)
          loggerService.error(
            `[InterviewApp] [doneInterview] Some files upload totally failed totallyFailedfiles:`,
            this.totallyFailedfiles,
          )
        await Promise.all(this.updatePrms)
        loggerService.info('[InterviewApp] [doneInterview] All upload updates fulfilled')
      } catch (err) {
        loggerService.error('[InterviewApp] [doneInterview] error when waiting for prms', err, {
          updatePrms: this.updatePrms,
        })
      } finally {
        this.saveApplicant()
        window.onbeforeunload = null
        this.initInterview()
      }
    },

    async saveApplicant() {
      const timeEvent = timelineService.activityEvent('submitted')

      const applicant = {
        ...this.applicant,
        timestamp: {...this.applicant.timestamp, submitted: Date.now()},
        timeline: [...this.applicant.timeline, timeEvent],
      }
      loggerService.info('[InterviewApp] [saveApplicant] Save full applicant (add submitted time event)', {applicant})
      this.updateApplicant(applicant)
      socketService.emit(SOCKET_EMIT_DONE_INTERVIEW, getEmitData('submit', this.job, applicant))
    },

    handleQuit() {
      const timeEvent = timelineService.activityEvent('quited')
      const applicant = {
        ...this.applicant,
        timestamp: {...this.applicant.timestamp, quited: Date.now()},
        timeline: [...this.applicant.timeline, timeEvent],
      }
      loggerService.info('[InterviewApp] [handleQuit] Save full applicant (add quited time event)', {applicant})
      socketService.emit(SOCKET_EMIT_DONE_INTERVIEW, getEmitData('quit', this.job, applicant))
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
      // can change route to '//localhost:3030/api/applicant'
      const url = `${config.apiUrl}applicant/quited`
      navigator.sendBeacon(url, JSON.stringify({applicant, jobId: this.job._id}))
      loggerService.info(`[InterviewApp] [handleQuit] Applicant ${this.applicant.id} has quit the interview`)
    },
  },

  watch: {
    '$route.name': {
      handler: function (nextRoute) {
        if (nextRoute === 'OnBoarding') this.initInterview()
        this.isInterview = nextRoute === 'Interview'
      },
    },

    jobTitle() {
      document.title = `${this.job.company.name} | ${this.jobTitle}`
    },
  },

  components: {
    AppModal,
    InterviewError,
    LngMenu,
  },
}
</script>
