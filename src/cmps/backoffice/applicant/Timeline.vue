<template>
  <section class="timeline-app">
    <h4>{{ $getTrans('timeline') }}</h4>
    <div class="timeline-list">
      <time-event-preview
        v-for="(timeEvent, idx) in timelineToShow"
        :key="idx"
        :idx="idx"
        :timeEvent="timeEvent"
        :applicantName="applicantName"
        :jobTitle="jobTitle"
        @remove-note-event="onRemoveNoteEvent"
      />
    </div>
  </section>
</template>

<script>
import TimeEventPreview from './timeEventPreview.vue'
import cloneDeep from 'lodash.clonedeep'

export default {
  props: ['timeline', 'applicantName', 'jobTitle'],

  computed: {
    timelineToShow() {
      const timelineToShow = cloneDeep(this.timeline)
      return timelineToShow.reverse()
    },
  },

  methods: {
    onRemoveNoteEvent(noteEvent) {
      this.$emit('remove-note-event', noteEvent.noteId)
    },
  },

  components: {
    TimeEventPreview,
  },
}
</script>
