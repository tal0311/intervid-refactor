<template>
  <div class="mobile-add-cv-modal">
    <CvUpload :applicant-full-name="applicantFullName" @uploaded="onUploadCv" />
  </div>
</template>

<script>
import CvUpload from '@/cmps/interview/CvUpload.vue'

export default {
  components: {CvUpload},
  props: ['applicantFullName'],

  methods: {
    onUploadCv(cv) {
      this.$emit('on-close')
      this.$emit('on-cv-upload', cv)
    },
  },
}
</script>
