<template>
  <section class="items-indicator flex align-items-center">
    <span
      class="material-icons"
      v-for="item in selectedItems.slice(0, 10)"
      :style="{color: getColorByStatus(item)}"
      :key="item.id"
    >
      circle
    </span>
    <span class="selected-iteams-count" v-if="selectedItems.length > 10"> +{{ selectedItems.length - 10 }}</span>
  </section>
</template>

<script>
import {statusMap} from '@/services/constData'

export default {
  props: ['selectedItems'],
  methods: {
    getColorByStatus(item) {
      return item.status ? statusMap[item.status].color : 'gray'
    },
  },
}
</script>