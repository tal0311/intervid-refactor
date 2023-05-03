<template>
  <section class="items-indicator flex align-items-center">
    <span
      v-for="item in selectedItems.slice(0, 10)"
      :key="item.id"
      class="material-icons"
      :style="{color: getColorByStatus(item)}"
    >
      circle
    </span>
    <span v-if="selectedItems.length > 10" class="selected-iteams-count"> +{{ selectedItems.length - 10 }}</span>
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
