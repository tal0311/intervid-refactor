<template>
  <section class="interview-error">
    <NotSupported v-if="isBrowserErr" :err="interviewErr" />
    <NoMobileScreenShare v-else-if="interviewErr.type === 'NO_MOBILE_SCREEN_SHARE'" />
    <NotFound v-else-if="interviewErr.type === 'INTERVIEW_NOT_FOUND'" :msg="$getTrans('interview-not-available')" />
  </section>
</template>

<script>
import {browserErrorMap} from '@/services/errorService'

import NotSupported from '@/views/general/NotSupported.vue'
import NoMobileScreenShare from '@/views/general/NoMobileScreenShare.vue'
import NotFound from '@/views/general/NotFound.vue'

export default {
  components: {
    NotSupported,
    NoMobileScreenShare,
    NotFound,
  },
  props: {
    interviewErr: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isBrowserErr() {
      return browserErrorMap[this.interviewErr.type]
    },
  },
}
</script>
