<template>
  <section v-if="userToEdit" class="user-mgmt container">
    <div class="header">
      <ApplicantAvatar :size="100" :src="userToEdit.imgUrl" :username="userFullName" />
      <div class="header-txt">
        <h2>{{ userToEdit.fName }} {{ userToEdit.lName }}</h2>
        <p>
          {{ userToEdit.companyName || `${$getTrans('last-login')} - ` + lastLogin }}
        </p>
      </div>
      <!-- <lng-menu /> -->
    </div>
    <div class="main-content">
      <form class="user-profile" novalidate @submit.prevent="toggleEdit('user', $event)">
        <div class="row-header">
          <h2>{{ $getTrans('profile') }}</h2>
          <button>
            {{ isUserEdit ? `${$getTrans('save')}` : `${$getTrans('edit')}` }}
          </button>
        </div>

        <div class="row columns">
          <div class="half">
            <label for="fName">{{ $getTrans('first-name') }}</label>
            <p v-if="!isUserEdit">
              {{ userToEdit.fName || `${$getTrans('add-fname')}` }}
            </p>
            <main-input
              v-else
              v-model.trim="userToEdit.fName"
              input-name="firstName"
              :placeholder="$getTrans('first-name')"
              type="text"
              validate="required"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
            />
          </div>
          <div class="half">
            <label for="lName">{{ $getTrans('last-name') }}</label>
            <p v-if="!isUserEdit">
              {{ userToEdit.lName || $getTrans('add-lname') }}
            </p>
            <main-input
              v-else
              v-model.trim="userToEdit.lName"
              input-name="lName"
              :placeholder="$getTrans('last-name')"
              type="text"
              :on-blur="validateField"
              :errors="errors"
              styled="basic"
            />
          </div>
        </div>

        <div class="row">
          <div class="tooltip-container">
            <label for="profile-image">{{ $getTrans('profile-image') }}</label>
            <i class="material-icons info-tooltip" data-tooltip="Square image with maximum size of 200KB">
              info_outlined
            </i>
          </div>
          <ImgUpload :initial-img="userToEdit.imgUrl" @upload="onSetImg('img', $event)" />
        </div>

        <div class="row">
          <label for="email">{{ $getTrans('email-address') }}</label>
          <p v-if="!isUserEdit">{{ userToEdit.email }}</p>
          <main-input
            v-else
            v-model.trim="userToEdit.email"
            input-name="email"
            :placeholder="$getTrans('add-email')"
            type="email"
            validate="required|email"
            :on-blur="validateField"
            :errors="errors"
            styled="basic"
            autocomplete="email"
          />
        </div>

        <div class="row">
          <label for="phone">{{ $getTrans('phone-number') }}</label>
          <p v-if="!isUserEdit">
            {{ userToEdit.phone || `${$getTrans('add-phone-number')}` }}
          </p>
          <main-input
            v-else
            v-model.trim="userToEdit.phone"
            input-name="phone"
            :placeholder="$getTrans('add-phone-number')"
            type="text"
            :on-blur="validateField"
            :errors="errors"
            styled="basic"
          />
        </div>

        <div class="row">
          <label for="address">{{ $getTrans('home-address') }}</label>
          <p v-if="!isUserEdit">
            {{ userToEdit.address || `${$getTrans('add-home-address')}` }}
          </p>
          <main-input
            v-else
            v-model.trim="userToEdit.address"
            input-name="address"
            :placeholder="$getTrans('add-home-address')"
            type="text"
            :on-blur="validateField"
            :errors="errors"
            styled="basic"
          />
        </div>
      </form>

      <form class="company-profile" novalidate @submit.prevent="toggleEdit('company', $event)">
        <div class="row-header">
          <h2>{{ $getTrans('company') }}</h2>
          <button>
            {{ isCompanyEdit ? `${$getTrans('save')}` : `${$getTrans('edit')}` }}
          </button>
        </div>

        <div class="row">
          <label for="company-name">{{ $getTrans('company-name') }}</label>
          <p v-if="!isCompanyEdit">
            {{ userToEdit.companyName || `${$getTrans('add-company-name')}` }}
          </p>
          <main-input
            v-else
            v-model.trim="userToEdit.companyName"
            input-name="company-name"
            :placeholder="$getTrans('add-company-name')"
            type="text"
            validate="required"
            :on-blur="validateField"
            :errors="errors"
            styled="basic"
          />
        </div>

        <div class="row">
          <div class="tooltip-container">
            <label for="company-logo">{{ $getTrans('company-logo') }}</label>
            <i class="material-icons info-tooltip" data-tooltip="Square image with maximum size of 200KB">
              info_outlined
            </i>
          </div>
          <ImgUpload :initial-img="userToEdit.logoUrl" @upload="onSetImg('logo', $event)" />
        </div>
      </form>
    </div>

    <div class="profile-links">
      <RouterLink :to="{name: 'ForgotPassword', params: {isChangePass: true}}"
        >{{ $getTrans('reset-password') }}
      </RouterLink>
      <button class="logout-btn" @click="onLogout">
        {{ $getTrans('logout') }}
      </button>
    </div>
  </section>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {getValidateMsg, validate} from '@/services/errorService.js'

import ApplicantAvatar from '@/cmps/common/ApplicantAvatar.vue'
import ImgUpload from '@/cmps/common/ImgUpload.vue'

export default {
  components: {
    ApplicantAvatar,
    ImgUpload,
  },
  data() {
    return {
      headers: [
        {txt: 'first-name', key: 'fName'},
        {txt: 'last-name', key: 'lName'},
        {txt: 'email', key: 'email'},
        {txt: 'actions'},
      ],
      isUserEdit: false,
      isCompanyEdit: false,
      userToEdit: null,
      errors: null,
    }
  },
  computed: {
    ...mapGetters('user', ['loggedInUser']),

    lastLogin() {
      return this.loggedInUser.lastLogin ? this.$formatDate(this.loggedInUser.lastLogin) : 'First login'
    },

    userFullName() {
      return this.$utilService.getFullName(this.loggedInUser)
    },
  },
  mounted() {
    this.userToEdit = this.$utilService.deepClone(this.loggedInUser)
  },

  methods: {
    ...mapActions('user', ['updateUser', 'sendVerifyEmail']),

    // onSendVerifyEmail() {
    //   this.verifyEmailSent = true
    //   this.sendVerifyEmail()
    // },

    onSetImg(imgType, imgUrl) {
      this.userToEdit[imgType + 'Url'] = imgUrl
      this.updateUser({user: this.userToEdit})
    },

    async toggleEdit(type, {target}) {
      switch (type) {
        case 'user':
          try {
            if (this.isUserEdit) {
              this.errors = validate(target)
              if (this.errors.length) return
              await this.updateUser({user: this.userToEdit})
            }
            this.isUserEdit = !this.isUserEdit
          } catch (err) {
            if (err.msg === 'EMAIL_TAKEN_ERR') this.errors.push(getValidateMsg('EMAIL_TAKEN', {name: 'email'}))
          }
          break
        case 'company':
          if (this.isCompanyEdit) {
            this.errors = validate(target)
            if (this.errors.length) return
            this.updateUser({user: this.userToEdit})
          }
          this.isCompanyEdit = !this.isCompanyEdit
          break

        default:
          break
      }
    },

    onLogout() {
      this.$store.dispatch('auth/logout')
    },

    validateField(ev) {
      if (!ev.target.form) return
      if (!this.errors) return
      this.errors = validate(ev.target.form)
    },
  },
}
</script>
