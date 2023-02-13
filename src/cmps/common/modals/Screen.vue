<template>
  <section
    @contextmenu.prevent="closeModals"
    class="screen"
    :class="{ on: isScreenShown, dark: isDarkScreen }"
    @click="closeModals"
  ></section>
</template>

<script>
export default {
  computed: {
    isScreenShown() {
      return !!this.$store.getters["app/modal"].type;
    },

    isDarkScreen() {
      return this.$store.getters["app/modal"].isDarkScreen;
    },
  },
  methods: {
    closeModals() {
      this.$store.dispatch("app/toggleModal", null);
    },
  },
};
</script>
