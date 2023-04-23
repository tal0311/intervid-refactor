<template>
  <div class="org-user-edit">
    <h2>
      {{ userToEdit ? $getTrans('edit-user') : $getTrans('add-user-to-organization') }}
      <button ref="close-btn" class="material-icons" @click="closeModal">close</button>
    </h2>

    <form novalidate @submit.prevent="onSaveUser">
      <div class="form-content">
        <div class="user-info">
          <div class="input-container">
            <main-input
              v-if="!onlyEmail"
              v-model.trim="user.fName"
              type="text"
              input-name="firstName"
              :placeholder="$getTrans('first-name')"
              validate="required"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
            />
            <main-input
              v-if="!onlyEmail"
              v-model.trim="user.lName"
              input-name="lastName"
              :placeholder="$getTrans('last-name')"
              type="text"
              styled="basic"
            />
            <main-input
              v-if="!onlyName"
              v-model.trim="user.email"
              input-name="email"
              :placeholder="$getTrans('email')"
              type="email"
              validate="required|email"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
            />
          </div>
          <div v-if="!onlyEmail && !onlyName" class="img-upload-container">
            <div class="logo">
              <ImgUpload :initial-img="user.logoUrl" @upload="onSetImg('logo', $event)" />
              <p>{{ $getTrans('logo-image') }}</p>
            </div>
            <div class="profile">
              <ImgUpload :initial-img="user.imgUrl" @upload="onSetImg('img', $event)" />
              <p>{{ $getTrans('profile-image') }}</p>
            </div>
          </div>
        </div>
        <div v-if="isAdmin" class="user-permissions">
          <div>
            <p class="title">{{ $getTrans('plans') }}</p>
            <div class="permission-types">
              <label v-for="(perm, key, index) in permissions" :key="index">
                <input v-model="user.perm" type="radio" :value="perm.id" />
                <span>{{ $getTrans(perm.id) }}</span>
              </label>
            </div>
          </div>
          <div>
            <p>{{ $getTrans('exceptional-permissions') }}</p>
            <div class="advanced-perms">
              <div
                v-for="(advancedPerm, key, index) in advancedPermsMap"
                :key="index"
                :class="{blocked: advancedPerm.isBlocked}"
              >
                <CheckboxInput
                  inline
                  :value="isAdvancedSelected(advancedPerm)"
                  :disabled="isDefaultSelect(advancedPerm) || advancedPerm.isBlocked"
                  @input="onToggleAdvancedPerm(advancedPerm.name)"
                />
                <span>{{ $getTrans(advancedPerm.name) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button>{{ $getTrans('save') }}</button>
    </form>
  </div>
</template>

<script>
import {userService} from '@/services/userService'
import {validate} from '@/services/errorService'

import {advancedPermsMap, permissions} from '@/services/constData'

import {mapActions} from 'vuex'

import ImgUpload from '@/cmps/common/ImgUpload.vue'

export default {
  props: ['userToEdit', 'onlyName', 'onlyEmail', 'data'],

  data() {
    return {
      user: userService.getEmptyUser(),
      isSaving: false,
      errors: null,
    }
  },

  computed: {
    advancedPermsMap() {
      return advancedPermsMap
    },

    permissions() {
      return permissions
    },

    isAdmin() {
      const loggedInUser = this.$store.getters['user/loggedInUser']
      return loggedInUser.role === 'admin'
    },
  },

  created() {
    if (this.data?.userToEdit) this.user = this.$utilService.deepClone(this.data.userToEdit)
    if (!this.user.advancedPrm) this.user.advancedPrm = {}
  },

  methods: {
    ...mapActions('user', ['addUser', 'updateUser']),

    async onSaveUser({target}) {
      this.errors = validate(target)
      if (this.errors.length) return
      this.isSaving = true
      try {
        const user = {...this.user}
        if (this.user._id) {
          await this.updateUser({user})
        } else {
          await this.addUser({user})
        }
        this.$emit('close')
      } catch (err) {
        console.error('Something went wrong:', err)
      } finally {
        this.isSaving = false
      }
    },

    onSetImg(imgType, imgUrl) {
      this.user[imgType + 'Url'] = imgUrl
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },

    isAdvancedSelected(advancedPerm) {
      return this.isDefaultSelect(advancedPerm) || this.user.advancedPrm[advancedPerm.name]
    },

    isDefaultSelect(advancedPerm) {
      return this.$store.getters['auth/verifyPerm'](advancedPerm, this.user)
    },

    onToggleAdvancedPerm(advancedPermKey) {
      this.user.advancedPrm[advancedPermKey] = !this.user.advancedPrm[advancedPermKey]
    },

    closeModal() {
      this.$store.dispatch('app/toggleModal', {type: null})
    },
  },

  watch: {
    userToEdit() {
      if (this.userToEdit) {
        this.user = this.$utilService.deepClone(this.userToEdit)
      }
    },
  },

  components: {ImgUpload},
}
</script>
