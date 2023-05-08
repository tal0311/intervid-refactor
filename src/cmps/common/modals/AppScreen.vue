<template>
  <section
    class="screen"
    :class="{on: isScreenShown, dark: isDarkScreen}"
    @contextmenu.prevent="closeModals"
    @click="closeModals"
  ></section>
</template>

<script>
export default {
  computed: {
    isScreenShown() {
      // I added this const and check as a temp solution, I needed to turn off the screen to solve a bug in the UserMenu from the First Alpha,
      // but didn't want to break all the other modals for now.
      // This whole cmp is unecessary in my opinion, since the modals in the app should boil down to a single generic slotted Modal component,
      // That uses things like the click-outside directive to control the behaviour from within, without relying on outdated practices.
      const nonScreenModals = ['user-menu']

      const activeModalType = this.$store.getters['app/modal'].type
      const isScreenModal = !nonScreenModals.includes(activeModalType)

      return isScreenModal && !!this.$store.getters['app/modal'].type
    },

    isDarkScreen() {
      return this.$store.getters['app/modal'].isDarkScreen
    },
  },
  methods: {
    closeModals() {
      this.$store.dispatch('app/toggleModal', null)
    },
  },
}
</script>
