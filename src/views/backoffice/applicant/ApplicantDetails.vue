<template>
  <main v-if="applicant && !isFetching" class="applicant-details">
    <div class="header">
      <div class="left">
        <Avatar :size="70" :src="applicant.info.imgUrl" :username="applicantFullName" />
        <div class="info-wrapper">
          <div class="main-info">
            <h3>{{ applicantFullName }}</h3>
            <p>{{ jobTitle }}</p>
          </div>
          <div class="contact">
            <div class="applicant-contact">
              <p :class="{muted: !applicant.info.email}" @click="onCopyField('email')">
                <i class="material-icons-outlined">email</i>
                <span>{{ applicant.info.email || 'N/A' }}</span>
              </p>
              <p :class="{muted: !applicant.info.phone}" @click="onCopyField('phone')">
                <i class="material-icons-outlined">phone</i>
                <span>{{ applicant.info.phone || 'N/A' }}</span>
              </p>
              <p :class="{muted: !applicant.info.hometown}" @click="onCopyField('hometown')">
                <i class="material-icons-outlined">home</i>
                <span>{{ applicant.info.hometown || 'N/A' }}</span>
              </p>
            </div>
            <div class="btn-container">
              <CvMenu :applicant="applicant" :applicant-cv-name="applicantCvName" @on-cv-uploaded="onCvUploaded" />

              <ApplicantMenu @on-archive-applicant="onArchiveApplicant" @on-edit-applicant="onEditApplicant" />
            </div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="status-container">
          <StatusDropdown :applicant="applicant" :is-full-width="true" @on-set-status="setStatus" />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="candidate-container">
        <div class="interview-container">
          <h4>{{ $getTrans('interview') }}</h4>
          <div class="video-container" :class="{empty: !Object.keys(applicant.answerMap).length}">
            <div class="ans-player-container">
              <VideoPlayer
                v-if="!!Object.keys(applicant.answerMap).length"
                ref="videoPlayer"
                :ans="selectedAns"
                :notes="[]"
              />
            </div>
          </div>

          <!-- <div class="quest-details" :class="{ open: isShowDesc }">
                  <div class="quest-title">
                    <h3>{{ selectedQuest.txt }}</h3>
                    <button @click="toggleShowDesc">
                      <i class="material-icons">expand_more</i>
                    </button>
                  </div>
                  <p class="quest-desc" v-html="selectedQuest.desc || $getTrans('no-description')"></p>
                </div> -->

          <VideoList
            v-if="Object.keys(applicant.answerMap).length"
            :applicant="applicant"
            :quests="job.quests"
            :selected-quest-idx="selectedQuestIdx"
            @go-to-quest="goToQuest"
          />
        </div>
      </div>

      <div class="recruiter-container">
        <div class="app-container">
          <NoteApp :notes="applicant.notes" @save-notes="saveNotes" />
          <TimeLine
            :timeline="applicant.timeline"
            :applicant-name="applicantFullName"
            :job-title="jobTitle"
            @remove-note-event="removeNoteEvent"
          />
        </div>
      </div>
    </div>

    <ApplicantEdit v-if="isEditOpen" :applicant="applicant" @update-applicant="onUpdateApplicant" />
  </main>
  <AppLoader v-else />
</template>

<script>
import {nextTick} from 'vue'
import {utilService} from '@/services/utilService'
import {advancedPermsMap} from '@/services/constData'
import {timelineService} from '@/services/timelineService'
import {jobService} from '@/services/jobService'

import {msgService} from '@/services/msgService'
import {socketService, SOCKET_ON_SAVE_APPLICANT} from '@/services/socketService'

import {historyRoutes} from '@/router'

import NoteApp from '@/cmps/backoffice/applicant/NoteApp.vue'
import StatusDropdown from '@/cmps/common/StatusDropdown.vue'
import AppLoader from '@/cmps/common/AppLoader.vue'
import TimeLine from '../../../cmps/backoffice/applicant/TimelineList.vue'
import VideoPlayer from '@/cmps/common/VideoPlayer.vue'
import Avatar from '@/cmps/common/ApplicantAvatar.vue'
import VideoList from '@/cmps/backoffice/applicant/VideoList.vue'
import ApplicantEdit from '@/cmps/backoffice/applicant/ApplicantEdit.vue'
import ApplicantMenu from '@/cmps/backoffice/applicant/ApplicantMenu.vue'
import CvMenu from '@/cmps/backoffice/applicant/CvMenu.vue'

export default {
  components: {
    NoteApp,
    StatusDropdown,
    AppLoader,
    TimeLine,
    VideoPlayer,
    Avatar,
    VideoList,
    ApplicantEdit,
    ApplicantMenu,
    CvMenu,
  },
  data() {
    return {
      selectedQuestIdx: 0,
      applicant: null,
      // isShowDesc: false,
    }
  },

  computed: {
    job() {
      return this.$store.getters['job/job']
    },

    jobTitle() {
      return this.applicant.jobInfo.title
    },

    isFetching() {
      return this.$store.getters['applicant/isFetching']
    },

    selectedQuest() {
      return this.job.quests[this.selectedQuestIdx]
    },

    selectedAns() {
      return this.applicant.answerMap[this.selectedQuest.id]
    },

    applicantFullName() {
      if (!this.applicant?.info) return ''
      return utilService.getFullName(this.applicant.info)
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isEditOpen() {
      return this.modal.type === 'applicant-edit'
    },

    applicantCvName() {
      const fullName = this.applicant.info.fName + this.applicant.info.lName
      return fullName.split(' ').join('-')
    },

    applicantName() {
      return (this.applicant && this.applicant.fName + ' ' + this.applicant.lName) || ''
    },

    isFreeUser() {
      return !this.$store.getters['auth/verifyPerm'](advancedPermsMap.UNLIMITED_INTERVIEWS)
    },
  },

  watch: {
    async $route() {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.setPlayerState('isPlaying', false)
        this.$refs.videoPlayer.setPlayerState('isLoading', true)
        this.$refs.videoPlayer.resetPlayer()
      }
      await this.loadApplicant()
      this.selectedQuestIdx = 0
      this.loadApplicantVideos()
    },
    applicantFullName() {
      if (!this.applicantFullName) return
      document.title = `Intervid | ${this.applicantFullName}`
    },
  },

  async created() {
    await this.loadApplicant()
    this.loadApplicantVideos()
    if (!this.applicant.isRead) this.setIsRead()
    socketService.on(SOCKET_ON_SAVE_APPLICANT, this.saveApplicantLocal)
  },

  unmounted() {
    socketService.off(SOCKET_ON_SAVE_APPLICANT, this.saveApplicantLocal)
    this.$store.dispatch('app/toggleModal', {type: null})
  },

  methods: {
    async loadApplicant() {
      const {jobId, applicantId} = this.$route.params
      await this.$store.dispatch('job/loadJobWithApplicant', {
        jobId,
        applicantId,
      })
      if (this.isFreeUser && !this.job.applicant.isFree) {
        this.$router.push({name: 'ApplicantOverview'})
        return
      }
      this.applicant = {
        ...this.$utilService.cloneDeep(this.job.applicant),
        jobInfo: {
          title: this.job.info.title,
          jobId: this.job._id,
        },
      }
    },

    async loadApplicantVideos() {
      const {applicantId} = this.$route.params
      // #HANDLE CANCEL
      const key = 'job/getApplicantVideos'
      const cancelToken = await this.$store.dispatch('app/handleCancelRequest', key)
      if (!this.job?._id || !applicantId) return
      const data = await jobService.getApplicantVideos(applicantId, this.job._id, cancelToken)
      if (!data) return
      const {answerMap} = data
      if (applicantId !== this.applicant.id) return
      this.applicant.answerMap = answerMap
      // this.setPlayerState('isLoading', false)
      if (this.$utilService.isEmpty(answerMap)) return
      nextTick(() => {
        // next tick so the ref of the video player is not undefined
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.setPlayerState('isLoading', false)
        }
      })
    },

    saveNotes(notes, timeEvent) {
      this.applicant = {
        ...this.applicant,
        notes,
        timeline: [...this.applicant.timeline, timeEvent],
      }
      this.saveApplicant()
    },

    setIsRead() {
      const applicant = {...this.applicant, isRead: true}
      this.$store.dispatch('job/updateApplicants', {applicants: [applicant]})
    },

    // addVideoWatchedAction(questIdx, watchSeconds) {
    //   const activity = activityMap.watch(
    //     `${this.applicantFullName}'s video, question number ${questIdx + 1} for ${secondsToTime(watchSeconds)}`,
    //   )
    //   this.addActivity(activity)
    // },

    // addActivity({ activity }) {
    //   activity.meta.applicantId = this.applicant._id
    //   this.$store.dispatch('activity/addActivity', { activity })
    // },

    async saveApplicant() {
      return await this.$store.dispatch('job/updateApplicants', {
        applicants: [this.$utilService.cloneDeep(this.applicant)],
      })
    },

    async onArchiveApplicant() {
      await this.$store.dispatch('job/toggleArchiveApplicant', {
        applicants: [this.applicant],
      })
      this.onGoBack()
      const msg = msgService.archive('applicant', true)
      this.$store.commit('app/setAlertData', {alertData: msg})
    },

    onGoBack() {
      const prevRoute = historyRoutes[historyRoutes.length - 1]
      // FIXME: ROUTER GO BACK
      // const prevRoute = historyRoutes[historyRoutes.length - 1];
      if (prevRoute.matched.length) this.$router.go(-1)
      else this.$router.push(!this.applicant.archivedAt ? '/backoffice/applicant' : '/backoffice/archive/applicant')
    },

    goToQuest(questIdx) {
      this.selectedQuestIdx = questIdx
    },

    async onCopyField(field) {
      await navigator.clipboard.writeText(this.applicant.info[field])
      const msg = msgService.copy(field)
      this.$store.commit('app/setAlertData', {alertData: msg})
    },

    toggleModal(type) {
      this.$store.dispatch('app/toggleModal', {type})
    },

    async onCvUploaded(file) {
      this.applicant.info.cv = file.name
      // this.applicant.info.cvUrl = file.xhrUpload?.endpoint
      this.applicant = {...this.applicant}
      await this.saveApplicant()
      this.loadApplicant()
    },

    async setStatus(statusCode) {
      const timeEvent = timelineService.statusEvent(statusCode)

      this.applicant = {
        ...this.applicant,
        status: statusCode,
        timeline: [...this.applicant.timeline, timeEvent],
      }

      await this.saveApplicant()

      // const desc = `to "${getStatusByCode(statusCode).label}" for candidate ${this.applicantFullName}`
      // this.$store.dispatch('activity/addActivity', activityMap.status({ desc }))
    },

    async removeNoteEvent(noteId) {
      const timelineToSave = this.$utilService.cloneDeep(
        this.applicant.timeline.filter((timeEvent) => timeEvent.type !== 'note' || timeEvent.noteId !== noteId),
      )
      const notesToSave = this.$utilService.cloneDeep(this.applicant.notes.filter((note) => note.id !== noteId))
      this.applicant = {
        ...this.applicant,
        timeline: timelineToSave,
        notes: notesToSave,
      }
      await this.saveApplicant()
    },

    saveApplicantLocal({applicant}) {
      if (this.applicant && applicant.id !== this.applicant.id) return
      this.applicant = {
        ...applicant,
        jobInfo: {
          title: this.job.info.title,
          jobId: this.job._id,
        },
      }
    },

    // toggleShowDesc() {
    //   this.isShowDesc = !this.isShowDesc
    // },

    onEditApplicant() {
      this.toggleModal('upload-cv')
      this.$store.dispatch('app/toggleModal', {
        type: 'applicant-edit',
        isDarkScreen: true,
      })
    },

    async onUpdateApplicant({applicant}) {
      this.applicant = {
        ...this.applicant,
        info: {
          ...applicant.info,
        },
      }
      await this.saveApplicant()
      this.$store.dispatch('app/toggleModal', {type: 'applicant-edit'})
    },
  },
}
</script>
