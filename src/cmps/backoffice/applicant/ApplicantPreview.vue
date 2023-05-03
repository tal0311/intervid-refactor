<template>
  <section
    class="applicant-preview"
    :class="{
      selected: isSelected,
      'not-read': !applicant.isRead,
      'not-free': isFreeUser && !applicant.isFree,
    }"
    @click="goToDetails"
  >
    <div class="checkbox" @click.stop>
      <CheckboxInput inline :value="isSelected" @input="$emit('select', applicant)" />
    </div>

    <div class="avatar">
      <ApplicantAvatar :size="40" :src="applicant.info.imgUrl" :username="applicantFullName" />
    </div>

    <div class="applicant-name">
      {{ applicantFullName }}
      <span v-if="applicant.info.isPreview">({{ $getTrans('demo') }})</span>
    </div>

    <div class="job-title">
      {{ applicant.jobInfo.title }}
    </div>

    <div class="hometown">
      {{ applicant.info.hometown || 'N/A' }}
    </div>

    <div class="status" @click.stop="">
      <StatusDropdown :applicant="applicant" :is-show-archived="filterBy.showArchived" @on-set-status="setStatus" />
    </div>

    <div class="date">
      {{ getFinishDate() }}
    </div>
  </section>
</template>

<script>
import {timelineService} from '@/services/timelineService'
// import { activityMap } from '@/services/activityService'
import {advancedPermsMap} from '@/services/constData'
import StatusDropdown from '@/cmps/common/StatusDropdown.vue'
import ApplicantAvatar from '@/cmps/common/ApplicantAvatar.vue'

export default {
  components: {
    StatusDropdown,
    ApplicantAvatar,
  },
  props: {
    applicant: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
    filterBy: {
      type: Object,
      required: true,
    },
  },
  emits: ['select'],
  data() {
    return {
      isMenuOpen: false,
    }
  },

  computed: {
    applicantFullName() {
      // return this.$getFullName(this.applicant.info)
      return this.$utilService.getFullName(this.applicant.info)
    },

    isFreeUser() {
      return !this.$store.getters['auth/verifyPerm'](advancedPermsMap.UNLIMITED_INTERVIEWS)
    },
  },

  methods: {
    getFinishDate() {
      const date = this.$route.path.includes('archive')
        ? this.applicant.archivedAt
        : this.applicant.timestamp.submitted || this.applicant.timestamp.quited

      if (!date) return 'N/A'
      return this.$formatDate(date)
    },

    goToDetails() {
      if (this.filterBy.showArchived || (this.isFreeUser && !this.applicant.isFree)) return
      this.$router.push(`/backoffice/details/${this.applicant.jobInfo.jobId}/${this.applicant.id}`)
    },

    async setStatus(statusCode) {
      const timeEvent = timelineService.statusEvent(statusCode)
      const applicant = {
        ...this.applicant,
        status: statusCode,
        timeline: [...this.applicant.timeline, timeEvent],
      }
      await this.$store.dispatch('job/updateApplicants', {
        applicants: [applicant],
      })
      // const desc = `to "${getStatusByCode(statusCode).label}" for candidate ${this.applicantFullName}`
      // this.$store.dispatch('activity/addActivity', activityMap.status({ desc }))
    },
  },
}
</script>
