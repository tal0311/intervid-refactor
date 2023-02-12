<template>
  <div class="backoffice-toggle" :class="{ right: selected === 'job' }">
    <router-link class="all" to="/backoffice/applicant">{{getTrans('applications')}}</router-link>
    <router-link class="job" to="/backoffice/job">{{getTrans('jobs')}}</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    routeName() {
      return this.$route.name
    },

    selected() {
      return this.routeName === 'ApplicantOverview' ? 'applicant' : 'job'
    },
  },
}
</script>
