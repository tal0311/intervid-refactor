<template>
  <section class="application">
    <div class="content">
      <div class="application-header">
        <img loading="lazy" :src="logoUrl" alt="logo" />
        <div class="job-info">
          <p>{{ job.company.name }}</p>
          <p>{{ job.info.title }}</p>
        </div>
      </div>

      <div class="application-info">
        <div class="job-title">
          <p>{{ $getTrans('job-title') }}</p>
          <p>{{ job.info.title }}</p>
        </div>
        <div v-if="job.info.location" class="job-location">
          <p>{{ $getTrans('location') }}</p>
          <p>{{ job.info.location }}</p>
        </div>
        <div v-if="job.info.desc" class="job-decription">
          <p>{{ $getTrans('job-description') }}</p>
          <p>{{ job.info.desc }}</p>
        </div>
      </div>
      <slot></slot>
    </div>
  </section>
</template>

<script>
import {loggerService} from '@/services/loggerService'

export default {
  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },

    logoUrl() {
      return (
        this.job?.company.logoUrl ||
        'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
      )
    },
  },
  mounted() {
    this.$store.commit('applicant/setIsInvitationPage', {
      isInvitationPage: true,
    })
    loggerService.info('[onBoarding] [Application] Mounted')
  },

  methods: {},
}
</script>
