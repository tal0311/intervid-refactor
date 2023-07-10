<template>
  <main class="main-app">
    <AppScreen />
    <AppHeader />
    <RouterView />
    <AppModal />
    <AppHelp />
  </main>
</template>

<script>
import AppScreen from '@/cmps/common/modals/AppScreen.vue'
import AppHeader from '@/cmps/AppHeader.vue'
import AppModal from '@/cmps/common/AppModal.vue'
import AppHelp from '@/cmps/common/AppHelp.vue'
export default {
  components: {
    AppHeader,
    AppModal,
    AppScreen,
    AppHelp,
  },
}
</script>
