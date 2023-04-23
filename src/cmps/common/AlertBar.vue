<template>
  <div v-if="alertData" class="notification-box" :class="`${alertData.type} ${displayClass}`">
    <i class="material-icons">{{ iconName }}</i>
    <span class="notification-txt">{{ alertData.txt }}</span>
    <button v-if="alertData.isUndo" class="undo-btn" @click="onUndo">Undo</button>
    <button v-else class="material-icons" @click="hideAlert">close</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timerOut: null,
    }
  },

  computed: {
    alertData() {
      return this.$store.getters['app/alertData']
    },

    iconName() {
      const iconTypeMap = {
        success: 'check_circle',
        fail: 'error',
        warning: 'warning_amber',
      }
      return iconTypeMap[this.alertData.type]
    },

    displayClass() {
      return this.timerOut ? 'on' : ''
    },
  },

  watch: {
    async alertData(data) {
      if (!data) return
      setTimeout(this.setAlertTime, 200)
    },
  },

  methods: {
    setAlertTime() {
      if (this.timerOut) clearTimeout(this.timerOut)
      var alertTime = this.alertData.isUndo ? 10000 : 3000
      var txtLength = this.alertData.txt.length
      if (txtLength > 50) alertTime = (txtLength / 30) * 1000
      this.timerOut = setTimeout(this.hideAlert, alertTime)
    },

    hideAlert() {
      this.resetTime()
      setTimeout(() => {
        this.$store.commit('app/setAlertData', {alertData: null})
      }, 200)
    },

    resetTime() {
      if (this.timerOut) clearTimeout(this.timerOut)
      this.timerOut = null
    },

    onUndo() {
      this.$store.dispatch('job/updateJob', {job: null, isUndo: true})
      this.hideAlert()
    },
  },
}
</script>
