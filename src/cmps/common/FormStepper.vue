<template>
  <div class="form-stepper" :class="{column: column}">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      class="step"
      :class="{done: currStepIdx > idx, curr: currStepIdx === idx}"
    >
      <span class="circle"></span>
      <div class="step-content">
        <span>{{ step.title }}</span>
        <span v-if="step.desc">{{ step.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
    },
    currStepIdx: {
      type: Number,
      required: true,
    },
    column: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    '$route.path'() {
      this.checkRoute()
    },
  },

  mounted() {
    this.checkRoute()
  },

  methods: {
    checkRoute() {
      const optionalRoutes = ['/create/:jobId?', '/interview/:jobId/']
      const isShowStepper = this.$route.matched.some((route) => {
        return optionalRoutes.some((optRoute) => optRoute === route.path)
      })
      if (!isShowStepper) {
        this.$store.commit('app/setProgressBar', {
          isShown: false,
          steps: [],
          currStepIdx: null,
        })
      }
    },
  },
}
</script>
