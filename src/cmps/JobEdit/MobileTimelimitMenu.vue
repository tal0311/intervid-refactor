<template>
  <div class="mobile-timelimit-modal mobile-modal-content">
    <button
      v-for="timelimit in timelimits"
      :key="timelimit.value"
      type="button"
      :class="{
        selected: selectedTimelimit.value === timelimit.value,
      }"
      @click.stop="$emit('set-timelimit', timelimit)"
    >
      {{ timelimit.txt }}
    </button>
  </div>
</template>

<script>
import {getTimeLimits} from '@/services/constData'

export default {
  props: {
    selectedTimelimit: {
      type: Object,
      required: true,
    },
  },
  emits: ['set-timelimit'],

  computed: {
    timelimits() {
      return getTimeLimits(this.$getTrans('mini-minutes'))
    },
  },
}
</script>
