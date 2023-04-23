<template>
  <div class="lng-menu" :class="{open: isOpen && !isMobile}">
    <button type="button" :class="{selected: isOpen && !isMobile}" @click="toggleModal">
      <!-- {{ selectedLng }} -->
      <!-- <i class="expand material-icons">expand_more</i> -->
      <i class="material-icons">language</i>
    </button>

    <div class="lng-modal">
      <p @click="setLang('en')">English</p>
      <p @click="setLang('he')">עברית</p>
    </div>

    <MobileModal v-if="isOpen && isMobile" cmp-name="lng" @on-close="toggleModal" />
  </div>
</template>

<script>
import MobileModal from './modals/MobileModal.vue'

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
      return this.modal.type === 'lng'
    },

    lang() {
      return this.$store.getters['app/lang']
    },

    selectedLng() {
      return this.lang === 'en' ? 'English' : 'עברית'
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', {type: 'lng'})
    },

    setLang(lang) {
      this.toggleModal()
      this.$store.dispatch('app/setLang', {lang})
    },
  },
}
</script>
