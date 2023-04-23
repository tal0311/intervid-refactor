<template>
  <div class="cover-upload">
    <AppSpinner v-if="isUploading" />

    <div v-if="initialCover" class="cover-preview">
      <img :src="coverPreview || initialCover" referrerpolicy="no-referrer" />
    </div>

    <button v-if="initialCover" type="button" class="open-modal" @click="toggleModal('change-cover')">
      {{ $getTrans('change-cover') }}
    </button>

    <div v-if="isOpen" class="modal-wrapper" @click="toggleModal('change-cover')">
      <div class="modal-content" @click.stop="">
        <div class="modal-header">
          <div class="modal-header-content">
            <h1>{{ $getTrans('select-cover-image') }}</h1>
            <div class="search-input">
              <main-input
                v-model.trim="value"
                input-name="search"
                :placeholder="$getTrans('search')"
                styled="basic"
                @input="onGetImgs"
              />
              <i class="material-icons">search</i>
            </div>
          </div>
          <i class="material-icons close-btn" @click="toggleModal('change-cover')">close</i>
        </div>

        <div class="files-container">
          <div v-if="imgs" class="img-container">
            <img
              v-for="img in imgs"
              :key="img.regular"
              :src="img.small ? img.small : img.regular"
              alt=""
              :class="{selected: checkIsSelectedImg(img)}"
              @click="onSelectImg(img)"
              @dblclick="onSelectImgAndAddCover(img)"
            />
          </div>

          <section v-else class="your-files">
            <p>
              {{ $getTrans('your-files') }}
              <i
                class="material-icons info-tooltip"
                data-tooltip="we supports all image files types such as JPG, PNG, GIF, WEBP"
              >
                info_outlined</i
              >
            </p>
            <div class="img-container">
              <label class="upload-label" :for="`upload-${id}`">
                <i class="material-icons">add</i>
                <p>{{ $getTrans('browse') }}</p>
              </label>

              <input
                :id="`upload-${id}`"
                class="upload-input"
                type="file"
                :name="`upload-${id}`"
                accept="image/*"
                @input="onUploadImg"
              />

              <div class="remove-cover" @click="onRemoveCover">
                <i class="material-icons">image_not_supported</i>
                <p>{{ $getTrans('no-cover') }}</p>
              </div>

              <img
                v-for="cover in user.coverUrls || coverImgs"
                :key="cover.small || cover.regular"
                :src="cover.small || cover.regular"
                alt=""
                :class="{selected: checkIsSelectedImg(cover)}"
                @click="onSelectImg(cover)"
                @dblclick="onSelectImgAndAddCover(cover)"
              />
            </div>
          </section>

          <section v-if="user.coverUrls && !imgs" class="site-files">
            <p>{{ $getTrans('site-files') }}</p>
            <div class="img-container">
              <img
                v-for="img in coverImgs"
                :key="img.small || img.regular"
                :src="img.small || img.regular"
                alt=""
                :class="{selected: checkIsSelectedImg(img)}"
                @click="onSelectImg(img)"
                @dblclick="onSelectImgAndAddCover(img)"
              />
            </div>
          </section>
        </div>

        <button type="button" class="select-btn" @click="onAddCover">
          {{ $getTrans('select') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppSpinner from './AppSpinner.vue'

import {mediaService} from '@/services/mediaService'
import {coverImgs} from '@/services/constData'

export default {
  components: {AppSpinner},
  props: ['initialCover', 'id'],

  data() {
    return {
      isUploading: false,
      coverPreview: null,
      value: '',
      imgs: null,
      selectedImg: null,
      user: null,
    }
  },

  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'change-cover' && this.modal.data.modalId === this.id
    },

    loggedInUser() {
      return this.$store.getters['user/loggedInUser']
    },

    coverImgs() {
      return coverImgs
    },
  },

  watch: {
    loggedInUser() {
      this.user = this.$utilService.deepClone(this.loggedInUser)
    },
  },

  created() {
    this.user = this.$utilService.deepClone(this.loggedInUser)
  },

  methods: {
    async onUploadImg(ev) {
      this.isUploading = true
      const file = ev.target.files[0]
      const imgSrc = await mediaService.readFile(file)
      const imgUrl = await mediaService.uploadImg(imgSrc)
      this.isUploading = false
      this.selectedImg = {regular: imgUrl}
      this.onAddCover()
    },

    // onGetImgs: this.$utilService.debounce(async function () {
    //   if (!this.value) {
    //     this.imgs = null
    //     return
    //   }
    //   this.imgs = await mediaService.getImgs(this.value)
    // }, 500),

    onSelectImg(img) {
      this.selectedImg = img
    },

    onAddCover() {
      if (!this.selectedImg) return
      if (!this.isCover) this.isCover = true

      if (
        !this.user.coverUrls?.some((coverUrl) => coverUrl === this.selectedImg) &&
        !this.coverImgs?.some((coverImg) => coverImg === this.selectedImg)
      ) {
        if (!this.user.coverUrls) this.user.coverUrls = []
        this.user.coverUrls.push(this.selectedImg)
      }

      this.onSetCover(this.selectedImg)
      this.toggleModal('change-cover')

      this.value = ''
      this.imgs = null
      this.selectedImg = null

      this.$store.dispatch('user/updateUser', {user: this.user})
    },

    onSetCover({regular}) {
      this.coverPreview = regular
      this.$emit('upload', regular)
    },

    toggleModal(type) {
      const modalId = this.isOpen ? null : this.id
      this.$store.dispatch('app/toggleModal', {type, data: {modalId}})
    },

    checkIsSelectedImg({regular}) {
      return this.selectedImg?.regular === regular
    },

    onSelectImgAndAddCover(img) {
      this.onSelectImg(img)
      this.onAddCover()
    },

    onRemoveCover() {
      this.$emit('upload', null)
      this.toggleModal()
    },
  },
}
</script>
