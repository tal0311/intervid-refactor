<template>
  <div class="btn-container">
    <button class="share" @click="toggleModal">
    <i class="material-icons">share</i>
      {{ getTrans('share') }}
    </button>
    <share-btns :job="job" :class="{ open: modal.type === 'share' }" />
  </div>
</template>

<script>
import ShareBtns from '../JobEdit/ShareBtns.vue'

export default {
  props: ['job'],

  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', { type: 'share' })
    },
  },

  components: { ShareBtns },
}
</script>
