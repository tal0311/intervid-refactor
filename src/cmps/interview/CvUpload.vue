<template>
  <div class="cv-upload">
    <h4>{{ $getTrans('resume') }}</h4>
    <small>{{ $getTrans('be-sure-include-updated-resume') }}</small>
    <div ref="elDragDrop" class="drag-drop" v-if="cvUploadProgress === 0"></div>
    <validation-msg v-if="error" :error="error" />
    <small v-if="cvUploadProgress === 0">DOC, DOCX, PDF (4MB)</small>
    <div class="progress-container">
      <div class="success" v-if="cvUploadProgress !== 0">
        <div class="left">
          <i class="material-icons"> description </i>
        </div>

        <div class="right">
          <div class="file-info">
            <p class="file-name">{{ fileName }}</p>
            <p class="uploaded-at">{{ $getTrans('uploaded-at') }} {{ createdAt }}</p>
          </div>
          <button type="button" @click="removeUploadedCv" v-if="cvUploadProgress === 100">
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>

      <div
        class="progress"
        v-if="cvUploadProgress !== 0 && cvUploadProgress !== 100"
        :style="{width: `${cvUploadProgress}%`}"
      ></div>
    </div>
  </div>
</template>

<script>
import {uploaderService} from '@/services/uploaderService'

import DragDrop from '@uppy/drag-drop'
import ValidationMsg from '@/cmps/common/ValidationMsg.vue'

export default {
  props: ['errors', 'applicantCvName'],

  data() {
    return {
      cvUploadProgress: 0,
      fileName: '',
      uppy: null,
      uploadedAt: null,
      fileId: null,
    }
  },

  mounted() {
    this.initUploadBtn()
  },

  computed: {
    createdAt() {
      return $formatDate(this.uploadedAt)
    },

    error() {
      return this.errors?.find((err) => err.elName === 'cv')?.msg
    },
  },

  methods: {
    initUploadBtn() {
      const restrictions = {
        maxFileSize: 5000000,
        maxNumberOfFiles: 1,
        allowedFileTypes: ['application/pdf', 'application/msword'],
      }

      const uppy = uploaderService.initUpload('intervid-cv', restrictions)

      uppy.use(DragDrop, {
        target: this.$refs.elDragDrop,
        width: '100%',
        height: '100%',
        locale: {
          strings: {
            dropHereOr: this.$getTrans('upload-resume'),
          },
        },
      })

      uppy.on('file-added', (file) => {
        this.fileName = file.name
        this.uploadedAt = Date.now()
        file.name = `${this.applicantCvName}-${this.uploadedAt}`
        this.fileId = file.name
      })
      uppy.on('upload-success', (file) => {
        this.$emit('uploaded', file)
      })
      uppy.on('progress', (progress) => {
        this.cvUploadProgress = progress
      })
      this.uppy = uppy
    },

    removeUploadedCv() {
      this.uppy.removeFile(this.fileId)
      this.cvUploadProgress = 0
      this.fileName = ''
      this.uploadedAt = null
      if (this.$refs.elDragDrop) this.$refs.elDragDrop.innerHTML = ''
      this.$emit('uploaded', {})
      this.$nextTick(this.initUploadBtn)
    },
  },

  components: {ValidationMsg},
}
</script>
