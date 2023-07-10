<template>
  <section class="user-feedback-content">
    <header class="feedback-modal-header">
      <div class="flex flex-grow">
        <span class="flex flex-grow flex-start">myInterview</span>
        <button @click="closeModal">
          <!--Change the icon later -->
          <span class="material-symbols-outlined"> close </span>
        </button>
      </div>
      <div class="flex flex-column">
        <p class="title">
          Hi {{ loggedInUser?.fName || '' }} 👋
          <br />
          How can we help?
        </p>

        <form @submit.prevent="onSubmit">
          <MainInput
            class="flex align-items-center"
            :is-textarea="true"
            input-name="feedback-txt"
            @update:modelValue="onUserInput"
          />
          <!-- <button v-if="formStep > 1" @click="onScreenCaption">Add screen caption</button> -->
          <!--Change the icon later -->
          <button class="flex-center">></button>
        </form>
      </div>
    </header>

    <main class="feedback-modal-main">some more content</main>

    <footer class="feedback-modal-footer">
      <p>some privacy text</p>
    </footer>
  </section>
</template>

<script>
import MainInput from '../MainInput.vue'
import {computed} from 'vue'
import {useStore} from 'vuex'

export default {
  setup() {
    const store = useStore()

    const loggedInUser = computed(() => store.state.user.loggedInUser)
    // const loggedInUser = computed(() => store.getters.loggedInUser)

    function closeModal() {
      store.dispatch('app/toggleModal', null)
    }

    function onSubmit(ev) {
      const userFeedback = {
        userMsg: ev.target[0].value,
        // TODO: screenCaption,
      }

      store.dispatch({type: 'app/handleUserFeedbackModal', userFeedback})
    }

    function onUserInput(userInput) {
      console.log('onUserInput', userInput)
    }

    // steps:
    // const formStep = ref(1)
    // function nextStep() {
    //   formStep.value++
    // }

    // TODO: add screen caption:
    // screen caption:
    // const isScreenCaption = ref(false)
    // function onScreenCaption() {
    //   console.log('caption')
    // }

    return {
      MainInput,
      loggedInUser,
      onSubmit,
      onUserInput,
      closeModal,
    }
  },
}
</script>
