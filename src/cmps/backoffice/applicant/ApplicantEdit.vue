<template>
  <section class="applicant-edit-wrapper" v-if="applicantToEdit.info" ref="edit-wrapper">
    <div class="applicant-edit" @click.stop="">
      <h2>
        {{ $getTrans('edit-applicant') }}
        <button @click="closeModal" ref="close-btn" class="material-icons">close</button>
      </h2>
      <form @submit.prevent="onUpdateApplicant" novalidate>
        <main-input
          inputName="fName"
          :label="$getTrans('f-name')"
          type="text"
          v-model.trim="applicantToEdit.info.fName"
          :errors="errors"
          styled="main"
          validate="required"
        />
        <main-input
          inputName="lName"
          :label="$getTrans('l-name')"
          type="text"
          v-model.trim="applicantToEdit.info.lName"
          :errors="errors"
          styled="main"
        />
        <main-input
          inputName="email"
          :label="$getTrans('email')"
          type="email"
          v-model.trim="applicantToEdit.info.email"
          :errors="errors"
          styled="main"
        />
        <main-input
          inputName="phone"
          :label="$getTrans('phone-number')"
          type="phone"
          v-model.trim="applicantToEdit.info.phone"
          :errors="errors"
          styled="main"
        />
        <main-input
          inputName="hometown"
          :label="$getTrans('hometown')"
          type="text"
          v-model.trim="applicantToEdit.info.hometown"
          :errors="errors"
          styled="main"
        />

        <button>{{ $getTrans('save') }}</button>
      </form>
    </div>
  </section>
</template>

<script>
import {validate} from '@/services/errorService.js'
import MainInput from '@/cmps/common/MainInput.vue'
import cloneDeep from 'lodash.clonedeep'

export default {
  props: ['applicant'],

  data() {
    return {
      applicantToEdit: {},
      errors: [],
    }
  },

  mounted() {
    this.applicantToEdit = cloneDeep(this.applicant)
  },

  methods: {
    onUpdateApplicant({target}) {
      try {
        this.errors = validate(target)
        if (this.errors.length) return
        this.$emit('update-applicant', {applicant: this.applicantToEdit})
      } catch (error) {
        this.errors = [error]
      }
    },

    closeModal() {
      this.$store.dispatch('app/toggleModal', {type: null})
    },
  },

  components: {MainInput},
}
</script>
