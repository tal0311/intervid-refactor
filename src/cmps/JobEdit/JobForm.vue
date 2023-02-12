<template>
  <div class="job-form">
    <cover-upload @upload="onSetCover" :initialCover="job.info.coverUrl" :id="id" />
    <section class="job-info">
      <div class="form-title">
        <main-input
          inputName="title"
          :placeholder="getTrans('job-title')"
          validate="required"
          v-model.trim="job.info.title"
          :onBlur="validateField"
          :errors="errors"
          styled="main"
        />
      </div>

      <div class="input-container">
        <img-upload @upload="onSetImg" :initialImg="job.company.logoUrl" />
        <main-input
          inputName="company"
          :label="getTrans('company-name')"
          validate="required"
          v-model.trim="job.company.name"
          :onBlur="validateField"
          :errors="errors"
          styled="main"
        />
        <main-input
          inputName="location"
          :label="getTrans('location')"
          v-model.trim="job.info.location"
          :onBlur="validateField"
          :errors="errors"
          styled="main"
        />
      </div>

      <div class="textarea-container" v-if="isDesc">
        <i class="icon material-icons remove-btn" @click="onClearDesc">close</i>
        <main-input
          inputName="description"
          :placeholder="getTrans('description')"
          validate="required"
          v-model.trim="job.info.desc"
          :errors="errors"
          styled="main"
          :onBlur="validateField"
          :isTextarea="true"
        />
      </div>

      <div class="toggle-container">
        <div class="main-toggle">
          <label> {{getTrans('candidate-cv')}}</label>
          <input type="checkbox" id="cv" name="cv" v-model="job.rule.isCvRequired" />
          <div class="outer">
            <div class="inner"></div>
            <p>{{getTrans('not-required')}}</p>
            <p>{{getTrans('required')}}</p>
          </div>
        </div>

        <div class="main-toggle">
          <label> {{getTrans('video-recording')}}</label>
          <input type="checkbox" id="one-try" name="one-try" v-model="job.rule.isOneTry" />
          <div class="outer">
            <div class="inner"></div>
            <p>{{getTrans('allow-multiple-tries')}}</p>
            <p>{{getTrans('allow-only-once')}}</p>
          </div>
        </div>
      </div>

      <div class="add add-desc" @click="isDesc = !isDesc" v-if="!isDesc">
        <i class="material-icons">add_circle_outline</i>
        {{getTrans('add-description')}}
      </div>

      <div v-if="!job.info.coverUrl" class="add add-desc" @click="toggleModal('change-cover')">
        <i class="material-icons">add_circle_outline</i>
        {{getTrans('add-cover')}}
      </div>
    </section>
  </div>
</template>

<script>
import { tooltips } from '@/services/constData.js'

import ImgUpload from '@/cmps/common/ImgUpload.vue'
import CoverUpload from '@/cmps/common/CoverUpload.vue'
import MainInput from '@/cmps/common/MainInput.vue'

export default {
  props: ['job', 'errors'],

  data() {
    return {
      isDesc: this.job.info.desc,
    }
  },

  created() {
    this.id = this._uid
  },

  computed: {
    logoUrl() {
      return (
        this.job?.company.logoUrl ||
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
      this.job.company.logoUrl = imgUrl
    },

    onSetCover(url) {
      this.job.info.coverUrl = url
      this.$emit('update-job')
    },

    onClearDesc() {
      this.job.info.desc = ''
      this.isDesc = this.job.info.desc
      this.$emit('update-job')
    },

    toggleModal(type) {
      const modalId = this.isOpen ? null : this.id
      this.$store.dispatch('app/toggleModal', { type, data: { modalId } })
    },
  },

  components: { ImgUpload, CoverUpload, MainInput },
}
</script>
