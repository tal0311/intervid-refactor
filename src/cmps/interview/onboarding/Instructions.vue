<template>
  <section class="instructions">
    <div class="content">
      <h2>{{ getTrans('you-ready-to-go') }}</h2>
      <div class="top">
        <p>
          {{ getTrans('the-interview-include') }} {{ questions }} {{ getTrans('and a total answer time of') }}
          {{ totalTime }} {{ getTrans('minutes') }}
        </p>

        <p>{{ getTrans('click-to-start-the-interview') }}</p>
      </div>
      <button class="main-btn" @click="$emit('on-next-step')">{{ getTrans('start-interview') }}</button>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    job() {
      return this.$store.getters['applicant/job']
    },

    questions() {
      const questCount = this.job.quests.length
      return questCount > 1 ? `${questCount} ${this.getTrans('questions')}` : this.getTrans('one-question')
    },

    totalTime() {
      return this.job.quests.reduce((acc, quest) => (acc += quest.timeLimit), 0)
    },
  },

  methods: {},
}
</script>
