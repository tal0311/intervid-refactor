<template>
  <ApplicationIndex class="embeded-preview" v-if="job">
    <button class="main-btn" @click="onApply">
      {{ $getTrans('apply-for-this-job') }}
    </button>
  </ApplicationIndex>
</template>

<script>
import config from '@/config'
import ApplicationIndex from '../interview/onboarding/ApplicationIndex.vue'

export default {
  created() {
    this.loadJob()
    this.setLang()
  },

  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },
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

  components: {ApplicationIndex},
}
</script>
