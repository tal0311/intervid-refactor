<template>
  <div :class="['cv-menu', {selected: isOpen && !isMobile}]">
    <button class="menu-btn" :class="cvInfo.class" @click="cvInfo.method" ref="elDragDrop"></button>

    <div class="menu-modal" :class="{open: isOpen && !isMobile}">
      <cv-upload @uploaded="$emit('on-cv-uploaded', $event)" :applicant-cv-name="applicantCvName" />
    </div>

    <mobile-modal
      v-if="isOpen && isMobile"
      cmp-name="upload-cv"
      :applicant-cv-name="applicantCvName"
      @on-close="toggleModal('upload-cv')"
      @on-cv-upload="$emit('on-cv-uploaded', $event)"
    />
  </div>
</template>

<script>
import CvUpload from '@/cmps/interview/CvUpload.vue'
import MobileModal from '@/cmps/common/modals/MobileModal.vue'

export default {
  props: ['applicantCvName', 'applicant'],

  computed: {
    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    cvInfo() {
      return this.applicant.info.cvUrl
        ? {class: 'view-cv', method: this.onDownloadCv}
        : {class: 'add-cv', method: this.toggleModal}
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'upload-cv'
    },
  },
  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', {type: 'upload-cv'})
    },

    async onDownloadCv() {
      const link = document.createElement('a')
      link.download = 'my-file.docx'
      link.href = this.applicant.info.cvUrl
      link.target = '_blank'
      link.click()
    },
  },

  components: {CvUpload, MobileModal},
}
</script>
