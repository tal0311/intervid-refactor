<template>
  <div class="user-menu">
    <div class="user-avatar" @click="toggleModal" v-if="loggedInUser">
      <applicant-avatar :size="35" :src="loggedInUser.imgUrl || loggedInUser.logoUrl" :username="userFullName" />
    </div>
    <div :class="{open: isOpen && !isMobile && loggedInUser}" class="user-modal">
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
    <RouterLink v-if="!loggedInUser" class="link" :to="authPath.to">{{ authPath.txt }}</RouterLink>

    <mobile-modal v-if="isOpen && isMobile" cmp-name="user-menu" @on-close="toggleModal" />
  </div>
</template>

<script>
import ApplicantAvatar from './ApplicantAvatar.vue'
import MobileModal from './modals/MobileModal.vue'

export default {
  computed: {
    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },

    userFullName() {
      // return this.$getFullName(this.loggedInUser)
      return this.$utilService.getFullName(this.loggedInUser)
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },

    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'user-menu'
    },

    authPath() {
      return this.$route.path.includes('login')
        ? {to: '/signup', txt: this.$getTrans('signup')}
        : {to: '/login', txt: this.$getTrans('login')}
    },

    isAdmin() {
      const loggedInUser = this.$store.getters['user/loggedInUser']
      return loggedInUser && loggedInUser.role === 'admin'
    },
  },

  methods: {
    toggleModal() {
      this.$store.dispatch('app/toggleModal', {type: 'user-menu'})
    },

    onLogout() {
      this.toggleModal()
      this.$store.dispatch('auth/logout')
    },

    onGoTo(name) {
      this.toggleModal()
      this.$router.push({name})
    },
  },

  components: {ApplicantAvatar, MobileModal},
}
</script>
