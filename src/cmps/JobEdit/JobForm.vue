<template>
  <div class="job-form">
    <cover-upload @upload="onSetCover" :initial-cover="mutableJob.info.coverUrl" :id="id" />
    <section class="job-info">
      <div class="form-title">
        <main-input
          input-name="title"
          :placeholder="$getTrans('job-title')"
          validate="required"
          v-model.trim="mutableJob.info.title"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
        />
      </div>

      <div class="input-container">
        <img-upload @upload="onSetImg" :initial-img="job.company.logoUrl" />
        <main-input
          input-name="company"
          :label="$getTrans('company-name')"
          validate="required"
          v-model.trim="mutableJob.company.name"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
        />
        <main-input
          input-name="location"
          :label="$getTrans('location')"
          v-model.trim="mutableJob.info.location"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
        />
      </div>

      <div class="textarea-container" v-if="isDesc">
        <i class="icon material-icons remove-btn" @click="onClearDesc">close</i>
        <main-input
          input-name="description"
          :placeholder="$getTrans('description')"
          validate="required"
          v-model.trim="mutableJob.info.desc"
          :errors="errors"
          styled="main"
          :on-blur="validateField"
          :is-textarea="true"
        />
      </div>

      <div class="toggle-container">
        <div class="main-toggle">
          <label> {{ $getTrans('candidate-cv') }}</label>
          <input type="checkbox" id="cv" name="cv" v-model="mutableJob.rule.isCvRequired" />
          <div class="outer">
            <div class="inner"></div>
            <p>{{ $getTrans('not-required') }}</p>
            <p>{{ $getTrans('required') }}</p>
          </div>
        </div>

        <div class="main-toggle">
          <label> {{ $getTrans('video-recording') }}</label>
          <input type="checkbox" id="one-try" name="one-try" v-model="mutableJob.rule.isOneTry" />
          <div class="outer">
            <div class="inner"></div>
            <p>{{ $getTrans('allow-multiple-tries') }}</p>
            <p>{{ $getTrans('allow-only-once') }}</p>
          </div>
        </div>
      </div>

      <div class="add add-desc" @click="isDesc = !isDesc" v-if="!isDesc">
        <i class="material-icons">add_circle_outline</i>
        {{ $getTrans('add-description') }}
      </div>

      <div v-if="!mutableJob.info.coverUrl" class="add add-desc" @click="toggleModal('change-cover')">
        <i class="material-icons">add_circle_outline</i>
        {{ $getTrans('add-cover') }}
      </div>
    </section>
  </div>
</template>

<script>
import {tooltips} from '@/services/constData.js'

import ImgUpload from '@/cmps/common/ImgUpload.vue'
import CoverUpload from '@/cmps/common/CoverUpload.vue'
import MainInput from '@/cmps/common/MainInput.vue'

export default {
  props: {
    job: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      required: true,
    },
  },
  emits: ['update-job', 'validate-field'],
  data() {
    return {
      isDesc: this.job.info.desc,
      mutableJob: this.job,
    }
  },

  created() {
    this.id = this.$utilService.makeCmpId()
  },

  computed: {
    logoUrl() {
      return (
        this.mutableJob?.company.logoUrl ||
        'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg'
      )
    },

    tooltips() {
      return tooltips
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'change-cover' && this.modal.data.modalId === this.id
    },
  },

  methods: {
    validateField(ev) {
      this.$emit('validate-field', ev)
    },

    onSetImg(imgUrl) {
      this.mutableJob.company.logoUrl = imgUrl
    },

    onSetCover(url) {
      this.mutableJob.info.coverUrl = url
      this.$emit('update-job')
    },

    onClearDesc() {
      this.mutableJob.info.desc = ''
      this.isDesc = this.mutableJob.info.desc
      this.$emit('update-job')
    },

    toggleModal(type) {
      const modalId = this.isOpen ? null : this.id
      this.$store.dispatch('app/toggleModal', {type, data: {modalId}})
    },
  },

  components: {ImgUpload, CoverUpload, MainInput},
}
</script>
