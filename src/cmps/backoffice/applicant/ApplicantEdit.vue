<template>
  <section v-if="applicantToEdit.info" ref="edit-wrapper" class="applicant-edit-wrapper">
    <div class="applicant-edit" @click.stop="">
      <h2>
        {{ $getTrans('edit-applicant') }}
        <button ref="close-btn" class="material-icons" @click="closeModal">close</button>
      </h2>
      <form novalidate @submit.prevent="onUpdateApplicant">
        <MainInput
          v-model.trim="applicantToEdit.info.fName"
          input-name="fName"
          :label="$getTrans('f-name')"
          type="text"
          :errors="errors"
          styled="main"
          validate="required"
        />
        <MainInput
          v-model.trim="applicantToEdit.info.lName"
          input-name="lName"
          :label="$getTrans('l-name')"
          type="text"
          :errors="errors"
          styled="main"
        />
        <MainInput
          v-model.trim="applicantToEdit.info.email"
          input-name="email"
          :label="$getTrans('email')"
          type="email"
          :errors="errors"
          styled="main"
        />
        <MainInput
          v-model.trim="applicantToEdit.info.phone"
          input-name="phone"
          :label="$getTrans('phone-number')"
          type="phone"
          :errors="errors"
          styled="main"
        />
        <MainInput
          v-model.trim="applicantToEdit.info.hometown"
          input-name="hometown"
          :label="$getTrans('hometown')"
          type="text"
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

export default {
  components: {MainInput},
  props: ['applicant'],

  data() {
    return {
      applicantToEdit: {},
      errors: [],
    }
  },

  mounted() {
    this.applicantToEdit = this.$utilService.deepClone(this.applicant)
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
}
</script>
