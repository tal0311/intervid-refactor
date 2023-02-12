<template>
  <section v-if="isArchive" class="empty-list archive" :class="{ applicant: itemName === 'applicant' }">
    <div class="content-container">
      <div class="txt-container">
        <h3>{{getTrans(archiveTitle)}}</h3>
      </div>
      <img loading="lazy" src="https://res.cloudinary.com/intervid/image/upload/v1661182015/Frontend/empty_tnkhmd.svg"
        alt="empty-list" />
    </div>
  </section>

  <section v-else-if="isTemplate" class="empty-list template">
    <div class="txt-container">
      <h3>{{getTrans('create-custom-question-and-template')}}</h3>
      <p>{{getTrans('no-template-to-show')}}</p>
      <a href="/backoffice/template/edit" class="create-btn">Create new template</a>
    </div>
    <img loading="lazy"
      src="https://res.cloudinary.com/intervid/image/upload/v1661182090/Frontend/customization_h5zxtb.svg"
      alt="empty-template-list" />
  </section>

  <section v-else-if="isFilteredCount" class="empty-list">
    <div class="content-container">
      <div class="txt-container">
        <h3>{{getTrans('no-exact-matches')}}</h3>
        <p>{{getTrans('try-changing-or-removing-your-filters')}}.</p>
      </div>
      <img loading="lazy" src="https://res.cloudinary.com/intervid/image/upload/v1661182015/Frontend/empty_tnkhmd.svg"
        alt="empty-list" />
    </div>
  </section>

  <!-- TODO: show loader when fetching -->
  <section v-else-if="(isJobDetails && currJob)" class="empty-list job-details">
    <div class="txt-container">
      <h3>{{getTrans('invite-candidates-to-apply')}}</h3>
      <p>{{getTrans('no-applicant-submitted-yet')}}</p>
    </div>
    <share-btns :job="currJob" />
  </section>

  <section v-else-if="!applicantCount || !totalJobCount" class="empty-list create-job">
    <div class="txt-container">
      <h3>{{getTrans('create-job-and-invite-candidate')}}</h3>
      <p>{{getTrans(archiveTitle)}}</p>
      <router-link class="create-btn" to="/create">
        <span>{{getTrans('create-new-job')}}</span>
      </router-link>
    </div>

    <div class="articles-container">
      <article>
        <div class="img-container">
          <img loading="lazy"
            src="https://res.cloudinary.com/intervid/image/upload/v1661182167/Frontend/emptylist-1_brrnhv.svg"
            alt="invite-candidates" />
        </div>
        <h3>{{getTrans('invite-candidates-to-apply')}}</h3>
        <p>
          {{getTrans('publish-or-send-link')}}
        </p>
      </article>
      <article>
        <div class="img-container">
          <img loading="lazy"
            src="https://res.cloudinary.com/intervid/image/upload/v1661182168/Frontend/emptylist-2_pqk23z.svg"
            alt="watch-video-interviews" />
        </div>
        <h3>{{getTrans('receive-video-recorded-job-interviews')}}</h3>
        <p>
          {{getTrans('watch-video-and-evaluate-msg')}}
        </p>
      </article>
      <article>
        <div class="img-container">
          <img loading="lazy"
            src="https://res.cloudinary.com/intervid/image/upload/v1661182167/Frontend/emptylist-3_zvvawp.svg"
            alt="move-on-with-your-preferred-candidates" />
        </div>
        <h3>{{getTrans('move-on-with-your-preferred')}}</h3>
        <p>
          {{getTrans('contect-with-leading-candidates')}}
        </p>
      </article>
    </div>
  </section>
</template>

<script>
import ShareBtns from '../JobEdit/ShareBtns.vue'

export default {
  props: ['itemName'],

  computed: {
    isArchive() {
      return this.$route.path.includes('archive')
    },

    isTemplate() {
      return this.$route.path.includes('template')
    },

    isJobDetails() {
      return this.$route.name === 'ApplicantOverview' && !!this.$route.params.jobId
    },

    currJob() {
      return this.$store.getters['job/job']
    },

    archiveTitle() {
      if (this.$route.path.includes('/applicant')) return 'no-applicant-to-show'
      if (this.$route.path.includes('/job')) return 'no-job-to-show'
      if (this.$route.path.includes('/template')) return 'no-template-to-show'
      return 'no-applicant-to-show'
    },

    applicantCount() {
      return this.currJob?.applicantSummary?.applicantCount
    },

    filteredApplicantCount() {
      return this.$store.getters['job/filteredApplicantCount']
    },

    totalJobCount() {
      return this.$store.getters['job/totalJobCount']
    },

    filteredJobCount() {
      return this.$store.getters['job/filteredJobCount']
    },

    isFilteredCount() {
      if (this.$route.path.includes('/applicant')) return !this.filteredApplicantCount && this.applicantCount
      if (this.$route.path.includes('/job')) return !this.filteredJobCount && this.totalJobCount
      return false
    },
  },

  components: { ShareBtns },
}
</script>
