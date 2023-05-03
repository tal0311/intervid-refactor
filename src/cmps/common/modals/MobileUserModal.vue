<template>
  <div class="mobile-user-modal mobile-modal-content">
    <button @click="onGoTo('ApplicantOverview')">
      {{ $getTrans('backoffice') }}
    </button>
    <button v-if="isAdmin" @click="onGoTo('AccountOverview')">
      {{ $getTrans('accounts') }}
    </button>
    <button v-if="isAdmin" @click="onGoTo('RecordOverview')">
      {{ $getTrans('logs') }}
    </button>
    <!-- <button v-if="isAdmin" @click="onGoTo('ActivityOverview')">{{ $getTrans('activity') }}</button> -->
    <button @click="onGoTo('UserMgmt')">{{ $getTrans('profile') }}</button>
    <button @click="onLogout">{{ $getTrans('logout') }}</button>
  </div>
</template>

<script>
export default {
  emits: ['on-close'],
  computed: {
    isAdmin() {
      const loggedInUser = this.$store.getters['user/loggedInUser']
      return loggedInUser.role === 'admin'
    },
  },

  methods: {
    toggleMenu() {
      this.$emit('on-close')
    },

    onGoTo(name, params) {
      this.toggleMenu()
      this.$router.push({name, params})
    },

    onLogout() {
      this.toggleMenu()
      this.$store.dispatch('auth/logout')
    },
  },
}
</script>
