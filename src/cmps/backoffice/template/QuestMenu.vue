<template>
  <div class="quest-menu">
    <button type="button" class="menu-btn material-icons" @click="toggleModal">
      more_horiz
    </button>

    <div class="menu-modal" :class="{ open: isOpen && !isMobile }">
      <button @click="onRemoveQuest">{{ getTrans("delete") }}</button>
    </div>

    <mobile-modal
      v-if="isOpen && isMobile"
      cmpName="quest-menu"
      :quest="quest"
      @on-close="toggleModal"
      @on-remove-quest="onRemoveQuest"
    />
  </div>
</template>

<script>
import MobileModal from "@/cmps/common/modals/MobileModal.vue";

export default {
  props: ["quest"],

  computed: {
    isMobile() {
      return this.$store.getters["app/isMobile"];
    },

    modal() {
      return this.$store.getters["app/modal"];
    },

    isOpen() {
      return (
        this.modal.type === "quest-menu" && this.modal.data === this.quest.id
      );
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch("app/toggleModal", {
        type: "quest-menu",
        data: this.quest.id,
      });
    },

    onRemoveQuest() {
      this.toggleModal();
      this.$emit("on-remove-quest");
    },
  },

  components: { MobileModal },
};
</script>
