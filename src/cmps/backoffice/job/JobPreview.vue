<template>
  <section
    v-if="viewType === 'list'"
    class="job-preview list"
    :class="{selected: isSelected}"
    @contextmenu.prevent="onOpenMenu"
    @click="goToApplicants"
  >
    <div class="checkbox" @click.stop="">
      <CheckboxInput inline :value="isSelected" @input="$emit('select', job)" />
    </div>

    <div class="title">
      {{ job.info.title }}
    </div>

    <div class="location">
      {{ job.info.location || 'N/A' }}
    </div>

    <div class="avatars">
      <template v-if="job.applicantSummary">
        <Avatar
          v-for="(applicant, index) in job.applicantSummary.avatars"
          :key="index"
          :size="32"
          :src="applicant.img"
          :username="applicant.username"
        />
        <div v-if="job.applicantSummary.applicantCount > 2">+{{ job.applicantSummary.applicantCount }}</div>
      </template>
    </div>

    <div class="date">
      {{ jobCreationDate }}
    </div>

    <div class="link" @click.stop="onCopyUrl">
      <i class="material-icons" :title="$getTrans('copy-link')">link</i>
      <p>{{ $getTrans('copy-link') }}</p>
    </div>

    <div class="actions" @click.stop="">
      <JobMenu
        ref="job-menu"
        :job="job"
        :mouse-pos="mousePos"
        @modal-closed="onCloseMenu"
        @archive="onToggleArchive"
        @load-jobs="$emit('load-items')"
      />
    </div>
  </section>

  <section
    v-else
    class="job-preview card"
    :class="{selected: isSelected}"
    @contextmenu.prevent="onOpenMenu"
    @click="goToApplicants"
  >
    <img v-if="coverUrl" loading="lazy" :src="coverUrl" alt="job-cover" class="job-cover" />
    <i v-else class="material-icons job-background">image_not_supported</i>

    <div class="bottom">
      <div class="top-line">
        <div class="info">
          <div class="title">{{ job.info.title }}</div>
          <span>|</span>
          <div class="location">{{ job.info.location || 'N/A' }}</div>
        </div>
        <div class="actions" @click.stop="">
          <JobMenu
            :job="job"
            :mouse-pos="mousePos"
            @archive="onToggleArchive"
            @modal-closed="onCloseMenu"
            @load-jobs="$emit('load-items')"
            @remove="$emit('remove', $event)"
          />
        </div>
      </div>

      <div class="bottom-line">{{ job.applicantSummary.applicantCount }} {{ $getTrans('applicants') }}</div>
    </div>

    <div class="link" @click.stop="onCopyUrl">
      <i class="material-icons" :title="$getTrans('copy-link')">link</i>
      <p>{{ $getTrans('copy-link') }}</p>
    </div>
  </section>
</template>

<script>
import {ref} from 'vue'
import {msgService} from '@/services/msgService'

import JobMenu from '@/cmps/backoffice/job/JobMenu.vue'
import Avatar from '@/cmps/common/ApplicantAvatar.vue'
import config from '@/config'

export default {
  components: {
    JobMenu,
    Avatar,
  },
  props: {
    job: {
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
  emits: ['select', 'load-items', 'remove'],

  setup() {
    const mousePos = ref(null)
    const onOpenMenu = ({pageX, pageY}) => {
      mousePos.value = {x: pageX, y: pageY}
    }
    const onCloseMenu = () => {
      mousePos.value = null
    }
    return {
      mousePos,
      onOpenMenu,
      onCloseMenu,
    }
  },
  data() {
    return {
      isMenuOpen: false,
    }
  },

  computed: {
    invitationUrl() {
      return `${config.baseUrl}interview/${this.job._id}`
    },

    coverUrl() {
      return this.job.info.coverUrl
    },

    viewType() {
      return this.$store.getters['job/viewType']
    },

    jobCreationDate() {
      const date = this.job.createdAt
      if (!date) return 'None'
      return this.$formatDate(date)
    },
  },

  methods: {
    goToApplicants() {
      if (this.filterBy.showArchived) return
      this.$router.push({
        name: 'ApplicantOverview',
        params: {jobId: this.job._id},
      })
    },

    onToggleArchive() {
      this.$store.dispatch({type: 'job/toggleArchiveJob', jobs: [this.job]})
      // const msg = msgService.archive('job', !this.job.archivedAt)
      // this.$store.commit('app/setAlertData', { alertData: msg })
    },

    async onCopyUrl() {
      await navigator.clipboard.writeText(this.invitationUrl)
      const msg = msgService.copy('link')
      this.$store.commit('app/setAlertData', {alertData: msg})
    },

    getApplicantFullname(applicant) {
      return `${applicant.info.fName} ${applicant.info.lName}`
    },

    // onOpenMenu(ev) {
    //   this.mousePos = { x: ev.pageX, y: ev.pageY }
    // },
  },
}
</script>
