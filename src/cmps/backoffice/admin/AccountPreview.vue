<template>
  <section class="account-preview">
    <div class="account-name">
      {{ fullName }}
    </div>

    <div class="email">
      {{ account.email }}
    </div>

    <div class="last-login">
      {{ lastLoginDate }}
    </div>

    <div class="interview-count">
      {{ account.interviewCount }}
    </div>

    <div class="permissions">
      {{ account.perm }}
    </div>

    <div class="actions">
      <i @click.stop="onEditAccount" class="material-icons md-dark" title="Edit Account">create</i>
      <i @click.stop="onRemoveAccount" class="material-icons md-dark" title="Remove Account">delete</i>
      <i
        @click.stop="setViewAs"
        title="View as Account"
        class="material-icons"
        :class="{
          'md-dark': viewAsUser ? viewAsUser._id !== account._id : true,
        }"
        >visibility</i
      >
    </div>
  </section>
</template>

<script>
import { formatDate, getFullName } from '@/services/utilService'

export default {
  props: ['account'],

  computed: {
    fullName() {
      return getFullName(this.account)
    },

    viewAsUser() {
      return this.$store.getters['user/viewAsUser']
    },

    lastLoginDate() {
      const date = this.account.lastLogin
      if (!date) return 'None'
      return formatDate(date, {
        getFullDate: true,
        includeTime: true,
        includeSeconds: true,
      })
    },
  },

  methods: {
    onEditAccount() {
      this.$store.dispatch('app/toggleModal', { type: 'AccountEdit', data: { userToEdit: this.account } })
    },

    onRemoveAccount() {
      const isConfirmed = confirm(`Are you sure you want to delete ${this.fullName}\'s account`)
      if (isConfirmed) this.$store.dispatch('user/removeUser', { userId: this.account._id })
    },

    // TODO: FIX SETVIEWAS
    setViewAs() {
      this.$store.commit('user/setViewAsUser', { viewAsUser: this.account })
    },
  },
}
</script>
