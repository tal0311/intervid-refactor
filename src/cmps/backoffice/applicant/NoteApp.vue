<template>
  <div class="note-app">
    <h4>{{ getTrans('note') }}</h4>
    <add-note :loggedInUser="loggedInUser" @add-note="onAddNote" />
    <note-preview v-if="lastNote" :note="lastNote" />
  </div>
</template>

<script>
import { timelineService } from '@/services/timelineService'
// import { activityMap } from '@/services/activityService'

import NotePreview from '@/cmps/backoffice/applicant/NotePreview.vue'
import AddNote from '@/cmps/backoffice/applicant/AddNote.vue'

export default {
  props: ['notes'],

  computed: {
    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },

    lastNote() {
      const lastNote = this.notes.reduce((acc, note, idx) => {
        acc = !acc || acc.createdAt < note.createdAt ? note : acc
        return acc
      }, null)
      return lastNote
    },
  },

  methods: {
    onAddNote(note) {
      const timeEvent = timelineService.noteEvent(note.txt, note.id)
      const notes = [note, ...this.notes]
      // this.addActivity('add', note)
      this.$emit('save-notes', notes, timeEvent)
    },

    // addActivity(type, note) {
    //   const desc = `"${note.txt} for candidate ${this.applicantFullName}`
    //   const activity = activityMap.note({ type, desc })
    //   this.$emit('activity', activity)
    // },
  },

  components: {
    AddNote,
    NotePreview,
  },
}
</script>
