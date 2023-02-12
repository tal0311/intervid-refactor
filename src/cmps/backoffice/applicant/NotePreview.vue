<template>
  <div class="note-preview">
    <i class="material-icons note-icon">description</i>
    <div class="note-content">
      <p class="note-txt">{{note.txt}}</p>
      <div>
        <span class="note-date">{{formattedDate}}</span>
        <i class="material-icons dot">circle</i>
        <span>{{getTrans('latest-note')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/services/utilService'

export default {
  props: ['note'],

  computed: {
    formattedDate() {
      return formatDate(this.note.createdAt)
    },
  },
}
</script>
