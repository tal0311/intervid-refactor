<template>
  <header class="main-header">
    <div class="header-content" :class="isSmallContainer ? 'narrow-container' : 'container'">
      <div class="logo-container">
        <RouterLink class="logo" :to="loggedInUser ? '/backoffice/applicant' : '/'">
          <img loading="lazy" :src="logoURL" alt="logo" />
        </RouterLink>
        <lng-menu v-if="!isJobEdit" />
      </div>

      <div class="btn-container">
        <div v-if="isJobEdit && jobToEdit" class="job-actions-container">
          <p v-if="!isFirstChange && !jobEditErrors.length" class="saving">
            {{ isSaving ? $getTrans('saving') : $getTrans('changes-saved') }}
          </p>
          <p v-if="jobEditErrors.length" class="saving error">
            {{ $getTrans('required-fields-missing') }}
          </p>
          <i v-if="jobToEdit._id" class="material-icons-outlined" @click="openPreview">visibility</i>
          <button
            class="send-btn"
            :class="[
              {
                disabled: !jobToEdit._id || (jobEditErrors && jobEditErrors.length),
              },
              {selected: this.modal.isDarkScreen},
            ]"
            @click="onShare"
          >
            {{ $getTrans('send') }}
          </button>
          <share-btns :job="jobToEdit" v-if="modal.type === 'share'" />
        </div>

        <div class="backoffice-nav-container" v-if="!!loggedInUser">
          <RouterLink
            to="/backoffice/applicant"
            class="backoffice-nav"
            :class="{selected: currRouteName === 'ApplicantOverview'}"
          >
            <i class="material-icons-outlined">group</i>
            <span>{{ $getTrans('applications') }}</span>
          </RouterLink>

          <RouterLink to="/backoffice/job" class="backoffice-nav" :class="{selected: currRouteName === 'JobOverview'}">
            <i class="material-icons-round">work_outline</i>
            <span>{{ $getTrans('jobs') }}</span>
          </RouterLink>

          <RouterLink
            v-if="verifyPerm(advancedPermsMap.TEMPLATES)"
            to="/backoffice/template"
            class="backoffice-nav"
            :class="{selected: currRouteName === 'TemplateOverview'}"
          >
            <i class="material-icons">assignment</i>
            <span>{{ $getTrans('templates') }}</span>
          </RouterLink>
        </div>

        <user-menu />
      </div>
    </div>
  </header>
</template>

<script>
import {userService} from '@/services/userService'
import {advancedPermsMap} from '@/services/constData'

import UserMenu from './common/UserMenu.vue'
import ShareBtns from './JobEdit/ShareBtns.vue'
import LngMenu from './common/LngMenu.vue'
import config from '@/config'
import { useShareJob } from '../composables/job/useShareJob'

export default {
  data() {
    return {
      isJobEdit: false,
      isSmallContainer: false,
    }
  },
  setup(){
    return {
      onShareJob: useShareJob()
    }
  },

  computed: {

    isMobile() {
      return this.$store.getters['app/isMobile']
    },
    modal() {
      return this.$store.getters['app/modal']
    },
    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },

    jobToEdit() {
      return this.$store.getters['job/jobToEdit']
    },

    isFirstChange() {
      return this.$store.getters['job/isFirstChange']
    },

    isSaving() {
      return this.$store.getters['job/isSaving']
    },

    jobEditErrors() {
      return this.$store.getters['job/jobEditErrors']
    },

    currRouteName() {
      return this.$route.name
    },

    advancedPermsMap() {
      return advancedPermsMap
    },

    invitationUrl() {
      return `${config.baseUrl}interview/${this.jobToEdit._id}`
    },

    logoURL() {
      return this.isJobEdit && this.isMobile
        ? 'https://res.cloudinary.com/intervid/image/upload/v1672757755/Frontend/mini-logo_kib4oh.png'
        : 'https://res.cloudinary.com/intervid/image/upload/v1661181884/Frontend/logo-color_kftsor.png'
    },
  },

  methods: {
    onShare() {
      // this.$root.$emit('share-job')
      this.onShareJob()
    },

    openPreview() {
      if (this.jobEditErrors && this.jobEditErrors.length) return
      window.open(`${this.invitationUrl}?demo=1`, '_blank')
    },

    verifyPerm(requiredPerm) {
      return this.$store.getters['auth/verifyPerm'](requiredPerm)
    },
  },

  watch: {
    '$route.name': {
      handler: function (routeName) {
        this.isJobEdit = routeName === 'JobEdit'
      },
      immediate: true,
    },
  },

  components: {UserMenu, ShareBtns, LngMenu},
}
</script>
,
