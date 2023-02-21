<template>
  <section v-if="isOpen" class="modal-wrapper" @mousedown="closeModal">
    <div class="modal-content" @mousedown.stop="" @click.stop="">
      <button v-if="isCloseable" @click="closeModal" class="dismiss">
        <i class="material-icons md-dark">close</i>
      </button>
      <component @close="closeModal" :is="cmp" :data="modal.data" />
    </div>
  </section>
</template>

<script>
import TimeUp from '@/cmps/interview/TimeUp.vue'
import OrgUserEdit from '@/cmps/common/user-mgmt/OrgUserEdit.vue'
import ResetPassword from '@/cmps/common/user-mgmt/ResetPassword.vue'
import ApplicationIndex from '@/cmps/interview/onboarding/ApplicationIndex.vue'
import ShareBtns from '@/cmps/JobEdit/ShareBtns.vue'
const modalTypes = ['TimeUp', 'AccountEdit', 'ResetPassword', 'ShareBtns', 'Application']

export default {
  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return modalTypes.includes(this.modal.type)
    },

    isCloseable() {
      return this.modal.data?.isCloseable || false
    },

    cmp() {
      switch (this.modal.type) {
        case 'TimeUp':
          return TimeUp
        case 'AccountEdit':
          return OrgUserEdit
        case 'ResetPassword':
          return ResetPassword
        case 'ShareBtns':
          return ShareBtns
        case 'Application':
          return ApplicationIndex
        default:
          return null
      }
    },
  },

  methods: {
    closeModal() {
      this.$store.dispatch('app/toggleModal', null)
    },
  },

  components: {
    TimeUp,
    OrgUserEdit,
    ResetPassword,
    ShareBtns,
    ApplicationIndex,
  },
}
</script>
