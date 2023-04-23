<template>
  <section class="applicant-menu">
    <button class="menu-btn" @click="toggleModal">
      <i class="material-icons">more_horiz</i>
    </button>

    <div class="menu-modal" :class="{open: isOpen && !isMobile}">
      <button @click="$emit('on-archive-applicant')">
        <i class="archive-btn material-icons-outlined">archive</i>
        {{ $getTrans('archive') }}
      </button>
      <button @click="$emit('on-edit-applicant')">
        <i class="archive-btn material-icons-outlined">edit</i>{{ $getTrans('edit-applicant') }}
      </button>
    </div>

    <MobileModal
      v-if="isOpen && isMobile"
      cmp-name="applicant-menu"
      @on-close="toggleModal"
      @on-archive-applicant="$emit('on-archive-applicant')"
      @on-edit-applicant="$emit('on-edit-applicant')"
    />
  </section>
</template>

<script>
import MobileModal from '@/cmps/common/modals/MobileModal.vue'

export default {
  components: {MobileModal},
  computed: {
    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'applicant-menu'
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', {type: 'applicant-menu'})
    },
  },
}
</script>
