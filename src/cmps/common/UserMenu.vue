<template>
  <div class="user-menu">
    <div v-if="loggedInUser" class="user-avatar" @click.stop="toggleModal">
      <ApplicantAvatar :size="35" :src="loggedInUser.imgUrl || loggedInUser.logoUrl" :username="userFullName" />
    </div>

    <div
      v-if="isOpen && !isMobileScreen"
      v-click-outside-calc="closeModal"
      :class="{open: isOpen && !isMobileScreen && loggedInUser}"
      class="user-modal"
    >
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
    <!-- </Teleport> -->
    <RouterLink v-if="!loggedInUser" class="link" :to="authPath.to">{{ authPath.txt }}</RouterLink>

    <MobileModal
      v-if="isOpen && isMobileScreen"
      v-click-outside-calc="closeModal"
      cmp-name="user-menu"
      @on-close="toggleModal"
    />
  </div>
</template>

<script>
import {onMounted} from 'vue'
// import {useIntersectionObserver} from '@/composables/util/useIntersectionObserver'
import ApplicantAvatar from './ApplicantAvatar.vue'
import MobileModal from './modals/MobileModal.vue'
import {useStore} from 'vuex'

export default {
  components: {ApplicantAvatar, MobileModal},
  setup() {
    const store = useStore()
    // const {observe} = useIntersectionObserver(closeModal)

    onMounted(() => {
      // observe('.header-content.container')
    })

    function closeModal() {
      // if (this.isMobileScreen || !this.isOpen) return
      console.log('closing')
      store.dispatch('app/toggleModal', null)
    }
    return {
      closeModal,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },

    userFullName() {
      // return this.$getFullName(this.loggedInUser)
      return this.$utilService.getFullName(this.loggedInUser)
    },

    isMobileScreen() {
      return this.$store.getters['app/isMobileScreen']
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
}
</script>
