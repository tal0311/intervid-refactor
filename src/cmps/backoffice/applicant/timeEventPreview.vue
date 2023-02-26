<template>
  <section class="time-event-preview" v-if="timeEvent">
    <i :style="{color: timeEventToShow.color}" class="time-event-icon material-icons" :class="timeEventToShow.icon">
      {{ timeEventToShow.icon }}
    </i>

    <div class="info">
      <div class="top">
        <p>{{ timeEventToShow.txt }}</p>
        <time-event-menu v-if="isNote" :idx="idx" @on-remove-note-event="onRemoveNoteEvent" />
      </div>

      <p>
        {{ formattedDate }} · {{ timeEventToShow.title }}
        <span v-if="timeEvent.timeStamp">
          at <a @click="jumpToTime()">{{ timeEvent.timeStamp }}</a></span
        >
      </p>
    </div>
  </section>
</template>

<script>
import {timelineService} from '@/services/timelineService'
import TimeEventMenu from './TimeEventMenu.vue'

export default {
  props: ['timeEvent', 'idx', 'jobTitle', 'applicantName'],
  computed: {
    timeEventToShow() {
      return timelineService.getTimeEventToShow(this.timeEvent, this.applicantName, this.jobTitle)
    },

    formattedDate() {
      return this.$formatDate(this.timeEvent.createdAt)
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
      this.$store.dispatch('app/toggleModal', {
        type: 'timeEvent',
        data: {id: this.idx},
      })
      this.$emit('remove-note-event', this.timeEvent)
    },

    toggleModal() {
      this.$store.dispatch('app/toggleModal', {
        type: 'timeEvent',
        data: {id: this.idx},
      })
    },

    // @Rotem need to refactor so it would work with proper time
    jumpToTime() {
      const [mins, secs] = this.timeEvent.timeStamp.split(':')
      this.$store.commit({
        type: 'player/setJumpToPoint',
        jumpToPoint: +mins * 60 + +secs,
      })
    },
  },

  components: {TimeEventMenu},
}
</script>
