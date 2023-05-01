<template>
  <div>
    <RegularModal />
    <AlertBar />
  </div>
</template>

<script>
import AlertBar from '@/cmps/common/AlertBar.vue'
import RegularModal from '@/cmps/common/RegularModal.vue'
import ActionsModal from '@/cmps/common/ActionsModal.vue'

export default {
  components: {
    AlertBar,
    RegularModal,
    ActionsModal,
  },
}
</script>
