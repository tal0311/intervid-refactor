<template>
  <section class="user-feedback">
    <header class="modal-header">
      <button @click="closeModal">
        <span class="material-symbols-outlined"> close </span>
      </button>
      <p>You can send feedback to Inter-vid</p>
    </header>
    <form @submit.prevent="onSubmit">
      <MainInput :isTextarea="true" input-name="feedback-txt" @update:modelValue="onUserInput" />
      <button v-if="formStep > 1" @click="onScreenCaption">Add screen caption</button>
      <button>Send</button>
    </form>
    <footer class="modal-footer">
      <p>some privacy text</p>
    </footer>
  </section>
</template>

<script setup>
import MainInput from '../MainInput.vue'
import {ref} from 'vue'
import {useStore} from 'vuex'

const store = useStore()

function closeModal() {
  store.dispatch('app/toggleModal', null)
}

function onSubmit(ev) {
  const userFeedback = {
    userMsg: ev.target[0].value,
    // TODO: screenCaption,
  }

  store.dispatch('app/handleUserFeedbackModal', userFeedback)
}

function onUserInput(userInput) {
  console.log('onUserInput', userInput)
}

// steps:
const formStep = ref(1)
function nextStep() {
  formStep.value++
}

// TODO: add screen caption:
// screen caption:
// const isScreenCaption = ref(false)
// function onScreenCaption() {
//   console.log('caption')
// }
</script>

<style lang="scss">
// .user-feedback[open] {
//  inset-inline-start: calc(-100% + 278px);
//  inset-block-start: 0;
// }
</style>