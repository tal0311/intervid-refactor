<template>
  <div class="mobile-add-cv-modal">
    <cv-upload @uploaded="onUploadCv" :applicantFullName="applicantFullName" />
  </div>
</template>

<script>
import CvUpload from "@/cmps/interview/CvUpload.vue";

export default {
  props: ["applicantFullName"],

  methods: {
    onUploadCv(cv) {
      this.$emit("on-close");
      this.$emit("on-cv-upload", cv);
    },
  },

  components: { CvUpload },
};
</script>
