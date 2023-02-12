<template>
  <section class="time-event-preview" v-if="timeEvent">
    <i :style="{ color: timeEventToShow.color }" class="time-event-icon material-icons" :class="timeEventToShow.icon">
      {{ timeEventToShow.icon }}
    </i>

    <div class="info">
      <div class="top">
        <p>{{ timeEventToShow.txt }}</p>

        <time-event-menu v-if="isNote" :idx="idx" @on-remove-note-event="onRemoveNoteEvent" />
      </div>

      <p>{{ formattedDate }} · {{ timeEventToShow.title }}</p>
    </div>
  </section>
</template>

<script>
import { formatDate } from '@/services/utilService'
import { timelineService } from '@/services/timelineService'
import TimeEventMenu from './TimeEventMenu.vue'

export default {
  props: ['timeEvent', 'idx', 'jobTitle', 'applicantName'],

  computed: {
    timeEventToShow() {
      return timelineService.getTimeEventToShow(this.timeEvent, this.applicantName, this.jobTitle)
    },

    formattedDate() {
      return formatDate(this.timeEvent.createdAt)
    },

    isNote() {
      return this.timeEvent.type === 'note'
    },

    modal() {
      return this.$store.getters['app/modal']
    },
  },

  methods: {
    onRemoveNoteEvent() {
      this.$store.dispatch('app/toggleModal', { type: 'timeEvent', data: { id: this.idx } })
      this.$emit('remove-note-event', this.timeEvent)
    },
  },

  components: { TimeEventMenu },
}
</script>
