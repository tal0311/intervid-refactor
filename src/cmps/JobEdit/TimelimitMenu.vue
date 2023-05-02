<template>
  <section v-if="selectedTimelimit" class="timelimit-container" :class="{open: isOpen}" @click="toggleModal">
    <i class="material-icons">schedule</i>
    <button type="button">
      {{ selectedTimelimit.txt }}
      <i class="expand material-icons">expand_more</i>
    </button>

    <div v-if="!isMobile" class="timelimit-modal">
      <button
        v-for="timelimit in timelimits"
        :key="timelimit.value"
        type="button"
        :class="{
          selected: selectedTimelimit.value === timelimit.value,
        }"
        @click.stop="setTimelimit(timelimit)"
      >
        {{ timelimit.txt }}
      </button>
    </div>

    <MobileModal
      v-else-if="isOpen"
      cmp-name="timelimit-menu"
      :selected-timelimit="selectedTimelimit"
      @on-close="toggleModal"
      @set-timelimit="setTimelimit($event)"
    />
  </section>
</template>

<script>
import {getTimeLimits} from '@/services/constData'
import MobileModal from '../common/modals/MobileModal.vue'

export default {
  components: {MobileModal},
  props: {
    quest: {
      type: Object,
      required: true,
    },
  },
  emits: ['change-timelimit'],

  data() {
    return {
      selectedTimelimit: null,
      mutableQuest: this.quest,
    }
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
      return getTimeLimits(this.$getTrans('mini-minutes'))
    },
  },

  mounted() {
    this.selectedTimelimit = this.timelimits.find((timelimit) => +timelimit.value === this.mutableQuest.timeLimit)
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
}
</script>
