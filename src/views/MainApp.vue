<template>
  <main class="main-app">
    <app-screen />
    <app-header />
    <RouterView />
    <app-modal />
  </main>
</template>

<script>
import AppScreen from '@/cmps/common/modals/AppScreen.vue'
import AppHeader from '@/cmps/AppHeader.vue'
import AppModal from '@/cmps/common/AppModal.vue'

export default {
  components: {
    AppHeader,
    AppModal,
    AppScreen,
  },
}
</script>
