<template>
  <div class="mobile-status-modal">
    <button
      v-for="(status, idx) in statusMap"
      :key="status.label"
      :style="{ backgroundColor: status.color }"
      @click="onSetStatus(idx)"
      :data-label="idx === '0' ? getTrans('evaluation') : idx === '5' ? getTrans('recruitment') : ''"
    >
      {{ getTrans(status.label) }}
    </button>
  </div>
</template>

<script>
import { statusMap } from '@/services/constData'

export default {
  computed: {
    statusMap() {
      return statusMap
    },
  },

  methods: {
    onSetStatus(statusCode) {
      this.$emit('set-status', statusCode)
    },
  },
}
</script>
