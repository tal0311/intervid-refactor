<template>
  <section
    class="applicant-preview"
    :class="{ selected: isSelected, 'not-read': !applicant.isRead, 'not-free': isFreeUser && !applicant.isFree }"
    @click="goToDetails"
  >
    <div class="checkbox" @click.stop="">
      <checkbox inline :value="isSelected" @input="$emit('select', applicant)"></checkbox>
    </div>

    <div class="avatar">
      <avatar :size="40" :src="applicant.info.imgUrl" :username="applicantFullName" />
    </div>

    <div class="applicant-name">
      {{applicantFullName}}
      <span v-if="applicant.info.isPreview">({{getTrans('demo')}})</span>
    </div>

    <div class="job-title">
      {{applicant.jobInfo.title}}
    </div>

    <div class="hometown">
      {{applicant.info.hometown || 'N/A'}}
    </div>

    <div @click.stop="" class="status">
      <status-dropdown :applicant="applicant" @on-set-status="setStatus" :isShowArchived="filterBy.showArchived" />
    </div>

    <div class="date">
      {{getFinishDate()}}
    </div>
  </section>
</template>

<script>
import { timelineService } from '@/services/timelineService'
// import { activityMap } from '@/services/activityService'
import { userService } from '@/services/userService'
import { advancedPermsMap } from '@/services/constData'
import { formatDate, getFullName } from '@/services/utilService'
import StatusDropdown from '@/cmps/common/statusDropdown.vue'
import Avatar from '@/cmps/common/Avatar.vue'

export default {
  props: ['applicant', 'isSelected', 'filterBy'],

  data() {
    return {
      isMenuOpen: false,
    }
  },

  computed: {
    applicantFullName() {
      return getFullName(this.applicant.info)
    },

    isFreeUser() {
      return !userService.verifyPerm(advancedPermsMap.UNLIMITED_INTERVIEWS)
    },
  },

  methods: {
    getFinishDate() {
      const date = this.$route.path.includes('archive')
        ? this.applicant.archivedAt
        : this.applicant.timestamp.submitted || this.applicant.timestamp.quited

      if (!date) return 'N/A'
      return formatDate(date)
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
      await this.$store.dispatch('job/updateApplicants', { applicants: [applicant] })
      // const desc = `to "${getStatusByCode(statusCode).label}" for candidate ${this.applicantFullName}`
      // this.$store.dispatch('activity/addActivity', activityMap.status({ desc }))
    },
  },

  components: {
    StatusDropdown,
    Avatar,
  },
}
</script>
