<template>
  <div class="backoffice-toggle" :class="{ right: selected === 'job' }">
    <RouterLink class="all" to="/backoffice/applicant">{{ getTrans('applications') }}</RouterLink>
    <RouterLink class="job" to="/backoffice/job">{{ getTrans('jobs') }}</RouterLink>
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
