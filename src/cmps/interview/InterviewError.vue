<template>
  <section class="interview-error">
    <not-supported v-if="isBrowserErr" :err="interviewErr" />
    <no-mobile-screen-share v-else-if="interviewErr.type === 'NO_MOBILE_SCREEN_SHARE'" />
    <not-found v-else-if="interviewErr.type === 'INTERVIEW_NOT_FOUND'" :msg="getTrans('interview-not-available')" />
  </section>
</template>

<script>
import { browserErrorMap } from '@/services/errorService'

import NotSupported from '@/views/general/NotSupported.vue'
import NoMobileScreenShare from '@/views/general/NoMobileScreenShare.vue'
import NotFound from '@/views/general/NotFound.vue'

export default {
  props: ['interviewErr'],

  computed: {
    isBrowserErr() {
      return browserErrorMap[this.interviewErr.type]
    },
  },

  components: {
    NotSupported,
    NoMobileScreenShare,
    NotFound,
  },
}
</script>
