<template>
  <main class="main-app">
    <screen />
    <app-header />
    <RouterView />
    <modal />
  </main>
</template>

<script>
import Screen from '@/cmps/common/modals/Screen.vue'
import AppHeader from '@/cmps/AppHeader.vue'
import Modal from '@/cmps/common/Modal.vue'

export default {
  components: {
    AppHeader,
    Modal,
    Screen,
  },
}
</script>
