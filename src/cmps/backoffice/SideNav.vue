<template>
  <aside v-if="!isMobile" class="side-nav">
    <section class="nav-links">
      <router-link class="nav-item" :to="'/backoffice/applicant'" :class="{ active: isActive('applicant') }">
        <div class="nav-item-header">
          <div class="nav-item-name">
            <i
              class="material-icons expand"
              :class="{ empty: applicantCount === 0, open: isApplicantOpen, hidden: applicantCount === 0 }"
              @click.prevent="setIsOpen('isApplicantOpen')"
            >
              expand_less
            </i>
            <i class="material-icons">group</i>
            <span>{{getTrans('applications')}}</span>
          </div>
          <span class="nav-item-count" v-if="applicantCount">
            {{applicantCount}}
          </span>
        </div>

        <div class="expand-list" :class="{ open: applicantCount > 0 && isApplicantOpen }">
          <router-link
            :to="`/backoffice/details/${applicant.jobId}/${applicant.id}`"
            class="expand-item"
            :class="{ active: isApplicantActive(applicant.id) }"
            v-for="(applicant, idx) in applicants"
            :key="idx"
          >
            {{applicant.fName + ' ' + applicant.lName}}
          </router-link>
        </div>
      </router-link>

      <router-link class="nav-item" :to="'/backoffice/job'" :class="{ active: isActive('job') }">
        <div class="nav-item-header">
          <div class="nav-item-name">
            <i
              class="material-icons expand"
              :class="{ empty: jobs.length === 0, open: isJobOpen, hidden: jobs.length === 0 }"
              @click.prevent="setIsOpen('isJobOpen')"
            >
              expand_less
            </i>
            <i class="material-icons">work</i>
            <span>{{getTrans('jobs')}}</span>
          </div>

          <span class="nav-item-count" v-if="totalJobCount">
            {{totalJobCount}}
          </span>
        </div>

        <div class="expand-list" :class="{ open: jobs.length > 0 && isJobOpen }">
          <router-link
            :to="`/backoffice/applicant/${job._id}`"
            class="expand-item"
            :class="{ active: isJobActive(job._id) }"
            v-for="(job, idx) in jobs"
            :key="idx"
          >
            {{job.info.title}}
          </router-link>
        </div>
      </router-link>

      <router-link
        v-if="verifyPerm(advancedPermsMap.TEMPLATES)"
        :to="'/backoffice/template'"
        class="nav-item"
        :class="{ active: isActive('template') }"
      >
        <div class="nav-item-header" @click="setIsOpen(null)">
          <div class="nav-item-name">
            <i class="material-icons expand"></i>
            <i class="material-icons">assignment</i>
            <span>{{getTrans('templates')}}</span>
          </div>
        </div>
      </router-link>

      <router-link class="nav-item" :to="'/backoffice/archive/applicant'">
        <div class="nav-item-header" @click="setIsOpen('isArchiveOpen')">
          <div class="nav-item-name">
            <i class="material-icons expand" :class="{ open: isArchiveOpen }">expand_less</i>
            <i class="material-icons">inventory</i>
            <span>{{getTrans('archive')}}</span>
          </div>
        </div>

        <div class="expand-list" :class="{ open: isArchiveOpen }">
          <span
            class="expand-item"
            :class="{ active: isArchiveActive('applicant') }"
            @click.prevent="onGoToArchive('applicant')"
          >
            {{getTrans('applications')}}
          </span>
          <span class="expand-item" :class="{ active: isArchiveActive('job') }" @click.prevent="onGoToArchive('job')">
            {{getTrans('jobs')}}
          </span>
          <span
            v-if="verifyPerm(advancedPermsMap.TEMPLATES)"
            class="expand-item"
            :class="{ active: isArchiveActive('template') }"
            @click.prevent="onGoToArchive('template')"
          >
            {{getTrans('templates')}}
          </span>
        </div>
      </router-link>
    </section>

    <section v-if="isAdmin" class="admin-links">
      <router-link class="nav-item" to="/backoffice/admin/account" :class="{ active: isActive('account') }">
        <div class="nav-item-header">
          <div class="nav-item-name" @click="setIsOpen('isAccountOpen')">
            <i class="expand"></i>
            <i class="material-icons">group</i>
            <span>{{getTrans('accounts')}}</span>
          </div>
        </div>
      </router-link>

      <router-link class="nav-item" to="/backoffice/admin/record" :class="{ active: isActive('record') }">
        <div class="nav-item-header">
          <div class="nav-item-name" @click="setIsOpen('isRecordOpen')">
            <i class="expand"></i>
            <i class="material-icons">admin_panel_settings</i>
            <span>{{getTrans('logs')}}</span>
          </div>
        </div>
      </router-link>

      <router-link class="nav-item" to="/backoffice/admin/activity" :class="{ active: isActive('activity') }">
        <div class="nav-item-header">
          <div class="nav-item-name" @click="setIsOpen('isActivityOpen')">
            <i class="expand"></i>
            <i class="material-icons">analytics</i>
            <span>{{getTrans('activity')}}</span>
          </div>
        </div>
      </router-link>
    </section>

    <router-link class="create-btn" to="/create">
      <i class="material-icons">add</i>
      <span>{{getTrans('create-new-job')}}</span>
    </router-link>
  </aside>
</template>

<script>
import { userService } from '@/services/userService'
import { advancedPermsMap, permissions } from '@/services/constData'

export default {
  data() {
    return {
      isApplicantOpen: false,
      isJobOpen: false,
      isArchiveOpen: false,
    }
  },

  computed: {
    jobs() {
      const jobs = this.$store.getters['job/jobsTitles'] || []
      return jobs.filter((job) => !job.archivedAt)
    },

    totalJobCount() {
      return this.$store.getters['job/totalJobCount'] || ''
    },

    applicants() {
      return this.$store.getters['job/applicantsTitles']
    },

    applicantCount() {
      return this.$store.getters['job/applicantCount']
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    isAdmin() {
      const loggedInUser = this.$store.getters['user/loggedInUser']
      return loggedInUser.role === 'admin'
    },

    permissions() {
      return permissions
    },

    advancedPermsMap() {
      return advancedPermsMap
    },
  },

  methods: {
    setIsOpen(key) {
      this.isApplicantOpen = key === 'isApplicantOpen' ? !this.isApplicantOpen : false
      this.isJobOpen = key === 'isJobOpen' ? !this.isJobOpen : false
      this.isArchiveOpen = key === 'isArchiveOpen' ? !this.isArchiveOpen : false
    },

    onGoToArchive(archiveBy) {
      if (this.$route.path.endsWith(`archive/${archiveBy}`)) return
      const path = this.$route.path.includes('archive') ? archiveBy : `archive/${archiveBy}`

      this.$router.push(path)
    },

    isActive(navItem) {
      const { path } = this.$route
      const isInNavItem = path.includes(navItem)
      const isInArchive = path.includes('archive')
      const isInTemplate = path.includes('template')
      const isInApplicantDetails = path.includes('details')
      const isInJob = !!this.$route.params.jobId
      switch (navItem) {
        case 'applicant':
          return isInNavItem && !isInApplicantDetails && !isInJob && !isInArchive
        case 'job':
          return isInNavItem && !isInJob && !isInArchive
        case 'template':
          return isInNavItem && isInTemplate && !isInArchive
        case 'archive':
          return isInNavItem && isInArchive
        case 'account':
          return isInNavItem
        case 'record':
          return isInNavItem
        case 'activity':
          return isInNavItem
      }
    },

    isArchiveActive(archiveBy) {
      return this.$route.path.endsWith(archiveBy) && this.isActive('archive')
    },

    isApplicantActive(applicantId) {
      return applicantId === this.$route.params.applicantId
    },

    isJobActive(jobId) {
      return jobId === this.$route.params.jobId
    },

    verifyPerm(requiredPerm) {
      return userService.verifyPerm(requiredPerm)
    },
  },
}
</script>
