<template>
  <section class="action-menu" ref="modal-wrapper">
    <button class="menu-btn" @click="toggleMenu">
      <span class="material-icons"> more_horiz </span>
    </button>

    <div
      class="menu-modal"
      :ref="template._id"
      :style="{ top: modalTop, insetInlineStart: modalInlineStart }"
      :class="{ open: isOpen && !isMobile, top: isBottom }"
    >
      <div @click.stop="onEditTemplate">{{getTrans('edit')}}</div>
      <div v-if="!isDefault" @click="emitAction('default')">{{getTrans('make-default')}}</div>
      <div @click.stop="emitAction('archive')">
        {{template.archivedAt ? getTrans('restore') : getTrans('archive')}}
      </div>
    </div>

    <mobile-modal
      v-if="isOpen && isMobile"
      :template="template"
      cmpName="template-menu"
      @on-edit-template="onEditTemplate"
      @emit-action="emitAction"
      @on-close="toggleMenu"
    />
  </section>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin.js'
import MobileModal from '@/cmps/common/modals/MobileModal.vue'

export default {
  props: ['template'],

  mixins: [ModalMixin],

  data() {
    return {
      modalHeight: 150,
      modalWidth: 200,
    }
  },

  computed: {
    isDefault() {
      return this.template?.isDefault
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    isOpen() {
      return this.modal.type === 'template-menu' && this.modal.data.modalId === this.template._id
    },
  },

  methods: {
    toggleMenu() {
      this.setModalPosition()
      const modalId = this.isTemplateMenuOpen ? null : this.template._id
      this.$store.dispatch('app/toggleModal', { type: 'template-menu', data: { modalId } })
    },

    emitAction(action) {
      this.toggleMenu()
      this.$emit(action, this.template)
    },

    onEditTemplate() {
      this.toggleMenu()
      this.$router.push(`/backoffice/template/edit/${this.template._id}`)
    },
  },

  components: { MobileModal },
}
</script>
