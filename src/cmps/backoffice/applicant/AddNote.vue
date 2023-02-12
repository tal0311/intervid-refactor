<template>
  <form class="add-note">
    <textarea
      v-model.trim="txt"
      required
      autocomplete="off"
      class="note-input"
      :class="{ active: txt.length }"
      name="txt"
      :placeholder="getTrans('add-note-on-candidate')"
    />

    <button type="button" @mousedown="addNote" class="save-btn">{{ getTrans('save') }}</button>
  </form>
</template>

<script>
import { getNote } from '@/services/applicantService'

export default {
  props: ['loggedInUser'],

  data() {
    return {
      txt: '',
    }
  },

  methods: {
    async addNote() {
      const note = getNote(this.txt, this.loggedInUser)
      this.txt = ''
      this.$emit('add-note', note)
    },
  },
}
</script>
