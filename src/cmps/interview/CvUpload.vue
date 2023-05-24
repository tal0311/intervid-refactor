<template>
  <div class="cv-upload">
    <h4>{{ $getTrans('resume') }}</h4>
    <small>{{ $getTrans('be-sure-include-updated-resume') }}</small>
    <div v-if="cvUploadProgress === 0" ref="elDragDrop" class="drag-drop" @click="toggleDrag(true)"></div>
    <ValidationMsg v-if="error" :error="error" />
    <small v-if="cvUploadProgress === 0">PDF (4MB)</small>
    <div class="progress-container">
      <div v-if="cvUploadProgress !== 0" class="success">
        <div class="left">
          <i class="material-icons"> description </i>
        </div>

        <div class="right">
          <div class="file-info">
            <p class="file-name">{{ fileName }}</p>
            <p class="uploaded-at">{{ $getTrans('uploaded-at') }} {{ createdAt }}</p>
          </div>
          <button v-if="cvUploadProgress === 100" type="button" @click="removeUploadedCv">
            <i class="material-icons">close</i>
          </button>
        </div>
      </div>

      <div
        v-if="cvUploadProgress !== 0 && cvUploadProgress !== 100"
        class="progress"
        :style="{width: `${cvUploadProgress}%`}"
      ></div>
    </div>
  </div>
</template>

<script>
import {nextTick} from 'vue'
import {uploaderService} from '@/services/uploaderService'

import DragDrop from '@uppy/drag-drop'
import ValidationMsg from '@/cmps/common/ValidationMsg.vue'

export default {
  components: {ValidationMsg},
  props: {
    errors: {
      type: Array,
      default: null,
    },
    applicantCvName: {
      type: String,
      required: true,
    },
  },
  emits: ['uploaded', 'uploadClick'],
  data() {
    return {
      cvUploadProgress: 0,
      fileName: '',
      uppy: null,
      uploadedAt: null,
      fileId: null,
    }
  },

  computed: {
    createdAt() {
      return this.$formatDate(this.uploadedAt)
    },

    error() {
      return this.errors?.find((err) => err.elName === 'cv')?.msg
    },
  },

  mounted() {
    this.initUploadBtn()
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
        onDrop: () => {
          this.toggleDrag(false)
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
      nextTick(this.initUploadBtn)
    },

    toggleDrag(isDrag) {
      this.$emit('uploadClick', isDrag)
    },
  },
}
</script>
