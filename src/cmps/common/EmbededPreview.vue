<template>
  <ApplicationIndex v-if="job" class="embeded-preview">
    <button class="main-btn" @click="onApply">
      {{ $getTrans('apply-for-this-job') }}
    </button>
  </ApplicationIndex>
</template>

<script>
import config from '@/config'
import ApplicationIndex from '../interview/onboarding/ApplicationIndex.vue'

export default {
  components: {ApplicationIndex},

  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },
  },
  created() {
    this.loadJob()
    this.setLang()
  },

  methods: {
    async loadJob() {
      const {jobId} = this.$route.params
      await this.$store.dispatch('applicant/loadJob', {jobId})
    },

    setLang() {
      const lang = this.$route.query.lng
      if (!['he', 'en'].includes(lang)) return
      this.$store.dispatch('app/setLang', {lang})
    },

    onApply() {
      window.open(`${config.baseUrl}interview/${this.job._id}`, '_blank')
    },
  },
}
</script>
