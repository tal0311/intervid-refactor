<template>
  <div ref="modalWrapper" class="status-dropdown" :class="{'full-width': isFullWidth}">
    <button
      ref="status-btn"
      class="status-btn"
      :class="{
        open: isOpen && !isMobile,
        recruitment: isRecruitmentStatus,
        top: modalPos.isBottom,
      }"
      :style="{
        backgroundColor: isDisabled ? '#EBEEF2' : applicantStatus.color,
        color: isDisabled ? '#AAADB5' : '#fff',
      }"
      @click="toggleModal"
    >
      {{ $getTrans(statusBtnTxt) }}
      <i v-if="!isDisabled && !isShowArchived" class="material-icons">expand_more</i>
    </button>

    <div class="status-modal" :class="modalClass" :style="modalStyle">
      <button
        v-for="(status, idx) in statusMap"
        :key="status.label"
        :style="{backgroundColor: status.color}"
        :data-label="idx === '0' ? $getTrans('evaluation') : idx === '5' ? $getTrans('recruitment') : ''"
        @click="onSetStatus(idx)"
      >
        {{ $getTrans(status.label) }}
      </button>
    </div>

    <MobileModal
      v-if="isOpen && isMobile"
      cmp-name="update status"
      :applicant="applicant"
      @on-close="toggleModal"
      @set-status="onSetStatus"
    />
  </div>
</template>

<script>
// core
import {computed, ref} from 'vue'
// lib
import {useStore} from 'vuex'
// custom composables
import {useModal} from '@/composables/useModal.js'
// services
import {activityMap} from '@/services/activityService'
import {getStatusByCode, statusMap} from '@/services/constData'
// cmps
import MobileModal from './modals/MobileModal.vue'

export default {
  components: {
    MobileModal,
  },
  props: {
    applicant: {
      type: Object,
      default: null,
    },
    isShowArchived: {
      type: Boolean,
      default: false,
    },
    isFullWidth: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-set-status', 'modal-closed'],
  setup(props, {emit}) {
    const store = useStore()
    const modalHeight = computed(() => 342)
    const modalWrapper = ref(null)
    const {isOpen, modalPos} = useModal({
      emit,
      modalHeight,
      modalType: 'status-picker',
      modalId: props.applicant.id,
      modalWrapper,
      listContainerSelector: '.list-content',
    })

    const isMobile = computed(() => {
      return store.getters['app/isMobile']
    })

    const modalStyle = computed(() => {
      // console.log('modalPos.value', modalPos.value)
      return {
        top: `${modalPos?.value.top}px`,
        width: `${modalPos?.value.modalWidth}px`,
      }
    })

    const modalClass = computed(() => {
      return {
        open: isOpen.value && !isMobile.value,
        top: modalPos.value.isBottom,
      }
    })

    return {
      modalWrapper,
      isOpen,
      modalClass,
      modalStyle,
      modalPos,
      isMobile,
    }
  },

  computed: {
    applicantStatus() {
      return getStatusByCode(this.applicant.status)
    },

    statusBtnTxt() {
      if (this.applicant.timestamp.quited) return 'incomplete-interview'
      else if (!this.applicant.timestamp.submitted) return 'in-progress'
      return this.applicantStatus.label
    },

    isDisabled() {
      return !this.applicant.timestamp.submitted
    },

    isRecruitmentStatus() {
      return (
        this.applicantStatus.label === 'Offer sent' ||
        this.applicantStatus.label === 'Not interested' ||
        this.applicantStatus.label === 'Hired'
      )
    },

    statusMap() {
      return statusMap
    },

    activityMap() {
      return activityMap
    },
  },

  methods: {
    toggleModal() {
      if (this.isDisabled || this.isShowArchived) return
      const modalId = this.isOpen ? null : this.applicant.id
      this.$store.dispatch('app/toggleModal', {
        type: 'status-picker',
        data: {modalId},
      })
    },

    async onSetStatus(statusCode) {
      this.toggleModal()
      if (statusCode === this.applicant.status) return
      this.$emit('on-set-status', statusCode)
    },
  },
}
</script>
