<template>
  <section class="backoffice">
    <div class="backoffice-content" :class="{'no-header': isFullscreenLayout, 'no-overflow-y': isCardView}">
      <div v-if="isMobileToggleShown" class="mobile-toggle-wrapper">
        <RouterLink class="mobile-create-btn" to="/create">
          <i class="material-icons">add</i>
        </RouterLink>
      </div>
      <RouterView />
    </div>
  </section>
</template>

<script>
import {msgService} from '@/services/msgService'
import {socketService, SOCKET_ON_DONE_INTERVIEW, SOCKET_ON_SAVE_APPLICANT} from '@/services/socketService'

export default {
  computed: {
    isMobileScreen() {
      return this.$store.getters['app/isMobileScreen']
    },

    isFullscreenLayout() {
      return (
        this.isMobileScreen && (this.$route.fullPath.includes('create') || this.$route.fullPath.includes('details'))
      )
    },

    isMobileToggleShown() {
      return this.$route.name === 'ApplicantOverview' || this.$route.name === 'JobOverview'
    },

    isCardView() {
      return this.$store.getters['job/viewType'] === 'cards'
    },
  },
  async created() {
    socketService.setUserWatch()
    socketService.on(SOCKET_ON_SAVE_APPLICANT, this.saveApplicant)
    socketService.on(SOCKET_ON_DONE_INTERVIEW, this.alertInterviewStatus)
  },
  metaInfo: {
    titleTemplate: null,
    meta: [
      {charset: 'utf-8'},
      {
        property: 'og:description',
        content: 'Home page.',
      },
    ],
  },
  unmounted() {
    socketService.off(SOCKET_ON_SAVE_APPLICANT, this.saveApplicant)
    socketService.off(SOCKET_ON_DONE_INTERVIEW, this.alertInterviewStatus)
  },

  methods: {
    async saveApplicant(data) {
      const commitType = data.type === 'add' ? 'addApplicant' : 'updateApplicants'
      await this.$store.commit(`job/${commitType}`, {
        applicants: [data.applicant],
      })
      if (data.type === 'add') this.alertInterviewStatus({...data, type: 'start'})
    },

    alertInterviewStatus({type, applicant}) {
      this.$store.commit({
        type: 'app/setAlertData',
        alertData: msgService[type](this.$utilService.getFullName(applicant.info)),
      })
    },
  },
}
</script>
