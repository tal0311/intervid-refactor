<template>
  <div v-if="mutableJob" class="job-form">
    <CoverUpload :id="id" :initial-cover="mutableJob.info.coverUrl" @upload="onSetCover" />
    <section class="job-info">
      <div class="form-title">
        <MainInput
          v-model="mutableJob.info.title"
          :placeholder="$getTrans('job-title')"
          input-name="title"
          validate="required"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
          @update:model-value="updateJobField('info.title', $event)"
        />
        <!-- :model-value="mutableJob.info.title"
          @update:model-value="mutableJob.info.title = $event" -->
      </div>

      <div class="input-container">
        <ImgUpload :initial-img="job.company.logoUrl" @upload="onSetImg" />
        <MainInput
          v-model="mutableJob.company.name"
          input-name="company"
          :label="$getTrans('company-name')"
          validate="required"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
          @update:model-value="updateJobField('info.company', $event)"
        />
        <MainInput
          v-model="mutableJob.info.location"
          input-name="location"
          :label="$getTrans('location')"
          :on-blur="validateField"
          :errors="errors"
          styled="main"
          @update:model-value="updateJobField('info.location', $event)"
        />
      </div>

      <div v-if="isDesc" class="textarea-container">
        <i class="icon material-icons remove-btn" @click="onClearDesc">close</i>
        <MainInput
          v-model="mutableJob.info.desc"
          input-name="description"
          :placeholder="$getTrans('description')"
          validate="required"
          :errors="errors"
          styled="main"
          :on-blur="validateField"
          :is-textarea="true"
          @update:model-value="updateJobField('description', $event)"
        />
      </div>

      <div class="toggle-container">
        <div class="main-toggle">
          <label> {{ $getTrans('candidate-cv') }}</label>
          <input id="cv" v-model="mutableJob.rule.isCvRequired" type="checkbox" name="cv" @input="updateCheckbox('isCvRequired', $event)"/>
          <div class="outer">
            <div class="inner"></div>
            <p>{{ $getTrans('not-required') }}</p>
            <p>{{ $getTrans('required') }}</p>
          </div>
        </div>

        <div class="main-toggle">
          <label> {{ $getTrans('video-recording') }}</label>
          <input id="one-try" v-model="mutableJob.rule.isOneTry" type="checkbox" name="one-try" @input="updateCheckbox('isOneTry', $event)"/>
          <div class="outer">
            <div class="inner"></div>
            <p>{{ $getTrans('allow-multiple-tries') }}</p>
            <p>{{ $getTrans('allow-only-once') }}</p>
          </div>
        </div>
      </div>

      <div v-if="!isDesc" class="add add-desc" @click="isDesc = !isDesc">
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
import cloneDeep from 'lodash.clonedeep'

export default {
  components: {ImgUpload, CoverUpload, MainInput},
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
  emits: ['update-job', 'validate-field', 'update-job-field'],

  data() {
    return {
      isDesc: this.job.info.desc,
      mutableJob: null,
    }
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
  watch: {
    job: {
      handler() {
        this.mutableJob = cloneDeep(this.job)
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.id = this.$utilService.makeCmpId()
  },
  methods: {
    updateCheckbox(target, ev) {
      //Function to update checkbox in the right order (not working with v-model: first change the job in editJob component and then changes the mutableJob)
      this.mutableJob.rule[target] = ev.target.checked  
      this.updateJobField()
    },
    updateJobField() {
      this.$emit('update-job-field', this.mutableJob)
    },

    validateField(ev) {
      this.$emit('validate-field', ev)
    },

    onSetImg(imgUrl) {
      this.mutableJob.company.logoUrl = imgUrl
      this.updateJobField()
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
}
</script>
