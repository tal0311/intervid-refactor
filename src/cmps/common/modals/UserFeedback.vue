<template>
 <section class="user-feedback">
  <header class="modal-header">
   <button @click="closeModal">
    <span class="material-symbols-outlined">
     close
    </span>
   </button>
   <p>You can send feedback to Inter-vid</p>
  </header>
  <MainInput :isTextarea="true" input-name="feedback-txt" />
  <button v-if="formStep > 1" @click="onScreenCaption">Add screen caption</button>
  <footer class="modal-footer">
   <p>some privacy text</p>
  </footer>
 </section>
</template>

<script setup>
import MainInput from '../MainInput.vue';
import { ref, onMounted } from 'vue'

function closeModal() {
 console.log('close modal');
}

// steps:
const formStep = ref(1)
function nextStep() {
 formStep.value++
}

// TODO: add screen caption:
// screen caption:
const isScreenCaption = ref(false)
function onScreenCaption() {
 console.log('caption')
}



</script>

<style lang="scss">
// .user-feedback[open] {
//  inset-inline-start: calc(-100% + 278px);
//  inset-block-start: 0;
// }
</style>