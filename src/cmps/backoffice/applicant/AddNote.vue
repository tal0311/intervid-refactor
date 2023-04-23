<template>
  <form class="add-note">
    <textarea
      v-model.trim="txt"
      required
      autocomplete="off"
      class="note-input"
      :class="{active: txt.length}"
      name="txt"
      :placeholder="$getTrans('add-note-on-candidate')"
    />
    <div class="btn-container">
      <button type="button" class="save-btn" @mousedown="addNote">
        {{ $getTrans('save') }}
      </button>

      <div v-if="verifyPerm(advancedPermsMap.BOOKMARKS)" class="bookmark-container">
        <div v-show="isTsOpen" class="ts-input-container">
          <input ref="input-mins" type="number" name="tsMins" placeholder="Min" :value="tsMins" @blur="checkLimit" />
          <span class="input-seperator"> : </span>
          <input ref="input-secs" type="number" name="tsSecs" placeholder="Sec" :value="tsSecs" @blur="checkLimit" />
        </div>
        <button type="button" class="ts-btn material-icons" :class="getActiveClass" @click="openTimeStamp">
          bookmark
        </button>
        <div v-if="isTsOpen && isWarning" class="video-limit-warning">Outside limits</div>
      </div>
    </div>
  </form>
</template>

<script>
import {getNote} from '@/services/applicantService'
import {advancedPermsMap} from '@/services/constData'
import {userService} from '@/services/userService'

export default {
  props: ['loggedInUser'],

  data() {
    return {
      txt: '',
      tsMins: null,
      tsSecs: null,
      isTsOpen: false,
      isWarning: false,
    }
  },
  computed: {
    advancedPermsMap() {
      return advancedPermsMap
    },
    getActiveClass() {
      return this.isTsOpen ? 'active' : ''
    },
    currVideoTime() {
      const totalSecs = this.$store.getters['player/playerState'].currTime
      return this.getTimeObject(totalSecs)
    },
    totalVideoTime() {
      const totalSecs = this.$store.getters['player/playerState'].totalDuration
      return this.getTimeObject(totalSecs)
    },
  },

  methods: {
    async addNote() {
      const note = getNote(this.txt, this.loggedInUser)
      // @Rotem need to refactor so it would work with proper time
      if (this.isTsOpen && this.tsMins && this.tsSecs) note.timeStamp = `${this.tsMins}:${this.tsSecs}`
      this.txt = ''
      this.tsMins = null
      this.tsSecs = null
      this.isTsOpen = false
      this.$emit('add-note', note)
    },
    checkLimit(ev) {
      const {name, value} = ev.target

      const totalTimeObj = this.totalVideoTime
      const totalVideoSecs = totalTimeObj.tsMins * 60 + totalTimeObj.tsSecs

      if (value.length <= 2) {
        //  && value <= totalTimeObj[name]
        if (name === 'tsSecs' && value <= 59 && +value + this.tsMins * 60 <= totalVideoSecs) {
          this[name] = `${value}`.padStart(2, 0)
          return
        } else if (name === 'tsMins' && +value <= totalTimeObj.tsMins && +value * 60 + +this.tsSecs <= totalVideoSecs) {
          this[name] = `${value}`.padStart(2, 0)
          return
        }
      }
      ev.target.value = this[name]
      this.toggleWarning()
    },
    toggleWarning() {
      this.isWarning = true
      setTimeout(() => (this.isWarning = false), 2500)
    },
    verifyPerm(requiredPerm) {
      return this.$store.getters['auth/verifyPerm'](requiredPerm)
    },

    openTimeStamp() {
      this.isTsOpen = !this.isTsOpen
      const currTime = this.currVideoTime
      this.tsMins = `${currTime.tsMins}`.padStart(2, 0)
      this.tsSecs = `${currTime.tsSecs}`.padStart(2, 0)
    },
    getTimeObject(totalSecs) {
      const mins = Math.floor(totalSecs / 60)
      const secs = Math.floor(totalSecs - mins * 60)
      return {
        tsMins: mins,
        tsSecs: secs,
      }
    },
  },
}
</script>
