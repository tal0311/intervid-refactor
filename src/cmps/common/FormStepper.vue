<template>
  <div class="form-stepper" :class="{ column: column }">
    <div
      class="step"
      v-for="(step, idx) in steps"
      :class="{ done: currStepIdx > idx, curr: currStepIdx === idx }"
      :key="idx"
    >
      <span class="circle"></span>
      <div class="step-content">
        <span>{{step.title}}</span>
        <span v-if="step.desc">{{step.desc}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['steps', 'currStepIdx', 'column'],

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

  watch: {
    '$route.path'() {
      this.checkRoute()
    },
  },
}
</script>
