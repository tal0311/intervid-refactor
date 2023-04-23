<template>
  <section class="timeline-app">
    <h4>{{ $getTrans('timeline') }}</h4>
    <div class="timeline-list">
      <TimeEventPreview
        v-for="(timeEvent, idx) in timelineToShow"
        :key="idx"
        :idx="idx"
        :time-event="timeEvent"
        :applicant-name="applicantName"
        :job-title="jobTitle"
        @remove-note-event="onRemoveNoteEvent"
      />
    </div>
  </section>
</template>

<script>
import TimeEventPreview from './timeEventPreview.vue'

export default {
  components: {
    TimeEventPreview,
  },
  props: ['timeline', 'applicantName', 'jobTitle'],

  computed: {
    timelineToShow() {
      const timelineToShow = this.$utilService.deepClone(this.timeline)
      return timelineToShow.reverse()
    },
  },

  methods: {
    onRemoveNoteEvent(noteEvent) {
      this.$emit('remove-note-event', noteEvent.noteId)
    },
  },
}
</script>
