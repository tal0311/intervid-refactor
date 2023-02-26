<template>
  <section class="timelimit-container" v-if="selectedTimelimit" @click="toggleModal" :class="{open: isOpen}">
    <i class="material-icons">schedule</i>
    <button type="button">
      {{ selectedTimelimit.txt }}
      <i class="expand material-icons">expand_more</i>
    </button>

    <div class="timelimit-modal" v-if="!isMobile">
      <button
        type="button"
        v-for="timelimit in timelimits"
        :key="timelimit.value"
        @click.stop="setTimelimit(timelimit)"
        :class="{
          selected: selectedTimelimit.value === timelimit.value,
        }"
      >
        {{ timelimit.txt }}
      </button>
    </div>

    <mobile-modal
      v-else-if="isOpen"
      cmpName="timelimit-menu"
      @on-close="toggleModal"
      :selectedTimelimit="selectedTimelimit"
      @set-timelimit="setTimelimit($event)"
    />
  </section>
</template>

<script>
import {getTimeLimits} from '@/services/constData'
import MobileModal from '../common/modals/MobileModal.vue'

export default {
  props: ['quest'],

  data() {
    return {
      selectedTimelimit: null,
      mutableQuest: this.quest,
    }
  },

  mounted() {
    this.selectedTimelimit = this.timelimits.find((timelimit) => +timelimit.value === this.mutableQuest.timeLimit)
  },

  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'timelimit-menu' && this.modal.data.modalId === this.mutableQuest.id
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    timelimits() {
      return getTimeLimits($getTrans('mini-minutes'))
    },
  },

  methods: {
    onChangeTimelimit() {
      this.mutableQuest.timeLimit = +this.selectedTimelimit.value
      this.$emit('change-timelimit')
    },

    toggleModal() {
      const modalId = this.isOpen ? null : this.mutableQuest.id
      this.$store.dispatch('app/toggleModal', {
        type: 'timelimit-menu',
        data: {modalId},
      })
    },

    setTimelimit(timelimit) {
      this.toggleModal()
      this.selectedTimelimit = timelimit
      this.onChangeTimelimit()
    },
  },

  components: {MobileModal},
}
</script>
