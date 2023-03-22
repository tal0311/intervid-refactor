<template>
  <section
    v-touch:moving="onDrag"
    ref="modal"
    class="mobile-modal"
    :style="{transform: `translateY(${dragPercent + '%'}`}"
  >
    <div class="modal-header" v-touch:start="onDown" v-touch:end="onUp">
      <h4>{{ $getTrans(cmpName) }}</h4>
    </div>

    <component
      :is="cmpToShow"
      :filter-by="filterBy"
      :job="job"
      :template="template"
      :applicant-full-name="applicantFullName"
      :quest="quest"
      :is-remove-shown="isRemoveShown"
      :expected-entity-count="expectedEntityCount"
      :filtered-job-count="filteredJobCount"
      :entity="entity"
      :updated-filter-by="updatedFilterBy"
      :is-one-try="isOneTry"
      :selected-ans-rule="selectedAnsRule"
      :selected-timelimit="selectedTimelimit"
      @on-close="closeModal"
      @edit-filter="(key, term) => $emit('edit-filter', key, term)"
      @set-filter="onSetFilter"
      @reset-filter="$emit('reset-filter')"
      @set-status="$emit('set-status', $event)"
      @select-status="$emit('select-status', $event)"
      @emit-action="$emit('emit-action', $event)"
      @on-archive-applicant="$emit('on-archive-applicant')"
      @on-edit-applicant="$emit('on-edit-applicant')"
      @on-edit-template="$emit('on-edit-template')"
      @on-remove-quest="$emit('on-remove-quest')"
      @on-remove-note-event="$emit('on-remove-note-event')"
      @on-cv-upload="$emit('on-cv-upload', $event)"
      @on-clone-job="$emit('on-clone-job')"
      @on-open-preview="$emit('on-open-preview')"
      @on-share="$emit('on-share')"
      @on-toggle-archive="$emit('on-toggle-archive')"
      @on-copy-url="$emit('on-copy-url')"
      @on-go-to-page="$emit('on-go-to-page', $event)"
      @set-ans-rule="$emit('set-ans-rule', $event)"
      @set-timelimit="$emit('set-timelimit', $event)"
    />
  </section>
</template>

<script>
import MobileJobMenuModal from '@/cmps/common/modals/MobileJobMenuModal.vue'
import MobileFilterModal from '@/cmps/common/modals/MobileFilterModal.vue'
import MobileUserModal from '@/cmps/common/modals/MobileUserModal.vue'
import MobileStatusModal from '@/cmps/common/modals/MobileStatusModal.vue'
import MobileLngModal from '@/cmps/common/modals/MobileLngModal.vue'
import MobileApplicantMenuModal from '@/cmps/common/modals/MobileApplicantMenuModal.vue'
import MobileAddCvModal from '@/cmps/common/modals/MobileAddCvModal.vue'
import MobileTemplateMenuModal from '@/cmps/common/modals/MobileTemplateMenuModal.vue'
import MobileInterviewFormMenuModal from '@/cmps/common/modals/MobileInterviewFormMenuModal.vue'
import MobileQuestEditMenu from '@/cmps/common/modals/MobileQuestEditMenu.vue'
import MobileTimeEventMenu from '@/cmps/common/modals/MobileTimeEventMenu.vue'
import MobileAnsRuleMenu from '@/cmps/JobEdit/MobileAnsRuleMenu.vue'
import MobileTimelimitMenu from '@/cmps/JobEdit/MobileTimelimitMenu.vue'

export default {
  props: [
    'cmpName',
    'filterBy',
    'job',
    'template',
    'applicantFullName',
    'quest',
    'isRemoveShown',
    'filteredJobCount',
    'expectedEntityCount',
    'entity',
    'updatedFilterBy',
    'isOneTry',
    'selectedAnsRule',
    'selectedTimelimit',
  ],

  data() {
    return {
      cmps: {
        filter: MobileFilterModal,
        'job-actions': MobileJobMenuModal,
        'user-menu': MobileUserModal,
        'update status': MobileStatusModal,
        lng: MobileLngModal,
        'applicant-menu': MobileApplicantMenuModal,
        'upload-cv': MobileAddCvModal,
        'template-menu': MobileTemplateMenuModal,
        'interview-form-menu': MobileInterviewFormMenuModal,
        'quest-menu': MobileQuestEditMenu,
        'time-event-menu': MobileTimeEventMenu,
        'ans-rule-menu': MobileAnsRuleMenu,
        'timelimit-menu': MobileTimelimitMenu,
      },
      isDragging: false,
      modalOptions: {
        diff: 0,
        mousePosY: 0,
        dragStartY: 0,
        modalTop: 0,
        modalHeight: 0,
      },
    }
  },

  mounted() {
    const {top, height} = this.$refs.modal.getBoundingClientRect()
    this.modalOptions.modalTop = top
    this.modalOptions.modalHeight = height
    document.body.style.overflow = 'hidden'
  },

  unmounted() {
    document.body.style.overflow = 'initial'
  },

  computed: {
    cmpToShow() {
      return this.cmps[this.cmpName]
    },

    dragPercent() {
      const {diff, modalHeight} = this.modalOptions
      const percent = (diff / modalHeight) * 100
      if (this.isDragging) return percent > 0 ? percent : 0
      return percent >= 50 ? 110 : 0
    },
  },

  methods: {
    closeModal() {
      this.$refs.modal.style.transform = 'translatey(110%)'
      setTimeout(() => {
        this.$emit('on-close')
      }, 200)
    },

    onSetFilter() {
      this.closeModal()
      this.$emit('set-filter')
    },

    onDown(ev) {
      this.isDragging = true
      this.modalOptions.diff = 0
      this.modalOptions.dragStartY = this.getClientY(ev)
    },
    onDrag(ev) {
      if (!this.isDragging) return
      this.modalOptions.mousePosY = this.getClientY(ev)
      this.modalOptions.diff = this.modalOptions.mousePosY - this.modalOptions.dragStartY
    },
    onUp() {
      this.isDragging = false
    },
    getClientY(ev) {
      return ev.type.includes('touch') ? ev.targetTouches[0].clientY : ev.clientY
    },
  },

  watch: {
    dragPercent(value) {
      if (value > 100) this.closeModal()
    },
  },

  components: {
    MobileFilterModal,
    MobileJobMenuModal,
    MobileUserModal,
    MobileStatusModal,
    MobileLngModal,
    MobileApplicantMenuModal,
    MobileAddCvModal,
    MobileInterviewFormMenuModal,
    MobileQuestEditMenu,
    MobileTimeEventMenu,
    MobileAnsRuleMenu,
  },
}
</script>
