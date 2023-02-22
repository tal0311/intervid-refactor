<template>
  <div>
    <regular-modal />
    <alert-bar />
  </div>
</template>

<script>
import AlertBar from '@/cmps/common/AlertBar.vue'
import RegularModal from '@/cmps/common/RegularModal.vue'

export default {
  components: {
    AlertBar,
    RegularModal,
  },
}
</script>
