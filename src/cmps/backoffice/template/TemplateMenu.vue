<template>
  <section class="action-menu" ref="modal-wrapper">
    <button class="menu-btn" @click="toggleMenu">
      <span class="material-icons"> more_horiz </span>
    </button>

    <div class="menu-modal" :ref="template._id">
      <div @click.stop="onEditTemplate">{{ getTrans("edit") }}</div>
      <div v-if="!isDefault" @click="emitAction('default')">
        {{ getTrans("make-default") }}
      </div>
      <div @click.stop="emitAction('archive')">
        {{ template.archivedAt ? getTrans("restore") : getTrans("archive") }}
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
// core
import { ref, computed } from "vue";
// lib
import { useStore } from "vuex";
// custom composables
import { useModal } from "@/composables/useModal.js";
// cmps
import MobileModal from "@/cmps/common/modals/MobileModal.vue";

export default {
  props: ["template"],

  setup(props) {
    const modalWidth = 200;
    const modalHeight = computed(() => 150);
    const modalWrapper = ref(null);

    const store = useStore();
    const { isOpen, top, insetInlineStart, isBottom } = useModal({
      modalWidth,
      modalHeight,
      modalWrapper,
      modalType: "template-menu",
      modalId: props.template._id,
    });

    const isMobile = computed(() => {
      return store.getters["app/isMobile"];
    });

    const modalStyle = computed(() => {
      return {
        top: `${top.value}px`,
        insetInlineStart: `${insetInlineStart.value}px`,
      };
    });

    const modalClass = computed(() => {
      return {
        open: isOpen.value && !isMobile.value,
        top: isBottom.value,
      };
    });

    return {
      modalStyle,
      modalClass,
      isOpen,
      isMobile,
    };
  },

  computed: {
    isDefault() {
      return this.template?.isDefault;
    },
  },

  methods: {
    toggleMenu() {
      const modalId = this.isTemplateMenuOpen ? null : this.template._id;
      this.$store.dispatch("app/toggleModal", {
        type: "template-menu",
        data: { modalId },
      });
    },

    emitAction(action) {
      this.toggleMenu();
      this.$emit(action, this.template);
    },

    onEditTemplate() {
      this.toggleMenu();
      this.$router.push(`/backoffice/template/edit/${this.template._id}`);
    },
  },

  components: { MobileModal },
};
</script>
