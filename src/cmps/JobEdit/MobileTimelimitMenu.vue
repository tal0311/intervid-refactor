<template>
  <div class="mobile-timelimit-modal mobile-modal-content">
    <button
      type="button"
      v-for="timelimit in timelimits"
      :key="timelimit.value"
      @click.stop="$emit('set-timelimit', timelimit)"
      :class="{
        selected: selectedTimelimit.value === timelimit.value,
      }"
    >
      {{ timelimit.txt }}
    </button>
  </div>
</template>

<script>
import {getTimeLimits} from '@/services/constData'

export default {
  props: ['selectedTimelimit'],

  computed: {
    timelimits() {
      return getTimeLimits(this.$getTrans('mini-minutes'))
    },
  },
}
</script>
