<template>
  <div class="quest-menu">
    <button type="button" class="menu-btn material-icons" @click="toggleModal">more_horiz</button>

    <div class="menu-modal" :class="{open: isOpen && !isMobileScreen}">
      <button @click="onRemoveQuest">{{ $getTrans('delete') }}</button>
    </div>

    <MobileModal
      v-if="isOpen && isMobileScreen"
      cmp-name="quest-menu"
      :quest="quest"
      @on-close="toggleModal"
      @on-remove-quest="onRemoveQuest"
    />
  </div>
</template>

<script>
import MobileModal from '@/cmps/common/modals/MobileModal.vue'

export default {
  components: {MobileModal},
  props: {
    quest: {
      type: Object,
      required: true,
    },
  },
  emits: ['on-remove-quest'],

  computed: {
    isMobileScreen() {
      return this.$store.getters['app/isMobileScreen']
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'quest-menu' && this.modal.data === this.quest.id
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', {
        type: 'quest-menu',
        data: this.quest.id,
      })
    },

    onRemoveQuest() {
      this.toggleModal()
      this.$emit('on-remove-quest')
    },
  },
}
</script>
