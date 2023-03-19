<template>
  <main class="onboarding-container">
    <component :is="componentToShow" @on-next-step="onNextStep" />
  </main>
</template>

<script>
import {faceService} from '@/services/faceService'

import {loggerService} from '@/services/loggerService'

import ApplicantForm from '@/cmps/interview/onboarding/ApplicantForm.vue'
import MediaCheck from '@/cmps/interview/onboarding/MediaCheck.vue'
import FormStepper from '@/cmps/common/FormStepper.vue'
import InterviewCountdown from '../interview-app/InterviewCountdown.vue'

export default {
  data() {
    return {
      currStep: 0,
      // cmps: {
      //   0: ApplicantForm,
      //   1: MediaCheck,
      //   2: InterviewCountdown,
      // },
    }
  },

  mounted() {
    faceService.loadModels()
  },

  computed: {
    applicant() {
      return this.$store.getters['applicant/applicant']
    },

    componentToShow() {
      const steps = ['ApplicantForm', 'MediaCheck', 'InterviewCountdown']

      return steps[this.currStep]
    },

    job() {
      return this.$store.getters['applicant/job']
    },
  },

  methods: {
    onNextStep() {
      this.currStep++
      if (this.currStep === 2) {
        loggerService.info(`[onboarding] [MediaCheck] Applicant ${this.applicant.id} passed Media Check Successfully`)
        if (this.job.rule.isOneTry) {
          this.currStep++
          loggerService.info(`[onboarding] [onNextStep] One try job - skipping general countdown`)
        }
      }
      // if (this.currStep > 2) this.$router.push(`/interview/${this.job._id}/inprogress`)
      if (this.currStep > 2) this.$router.push({name: 'InterviewIndex'})
    },
  },

  components: {
    ApplicantForm,
    MediaCheck,
    FormStepper,
    InterviewCountdown,
  },
}
</script>
