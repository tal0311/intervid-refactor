<template>
  <div class="cover-upload">
    <app-spinner v-if="isUploading" />

    <div v-if="initialCover" class="cover-preview">
      <img :src="coverPreview || initialCover" referrerpolicy="no-referrer" />
    </div>

    <button v-if="initialCover" type="button" @click="toggleModal('change-cover')" class="open-modal">
      {{ $getTrans('change-cover') }}
    </button>

    <div v-if="isOpen" @click="toggleModal('change-cover')" class="modal-wrapper">
      <div class="modal-content" @click.stop="">
        <div class="modal-header">
          <div class="modal-header-content">
            <h1>{{ $getTrans('select-cover-image') }}</h1>
            <div class="search-input">
              <main-input
                @input="onGetImgs"
                inputName="search"
                :placeholder="$getTrans('search')"
                v-model.trim="value"
                styled="basic"
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
              @click="onSelectImg(img)"
              @dblclick="onSelectImgAndAddCover(img)"
              :class="{selected: checkIsSelectedImg(img)}"
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
                @input="onUploadImg"
                class="upload-input"
                type="file"
                :name="`upload-${id}`"
                :id="`upload-${id}`"
                accept="image/*"
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
                @click="onSelectImg(cover)"
                @dblclick="onSelectImgAndAddCover(cover)"
                :class="{selected: checkIsSelectedImg(cover)}"
              />
            </div>
          </section>

          <section class="site-files" v-if="user.coverUrls && !imgs">
            <p>{{ $getTrans('site-files') }}</p>
            <div class="img-container">
              <img
                v-for="img in coverImgs"
                :key="img.small || img.regular"
                :src="img.small || img.regular"
                alt=""
                @click="onSelectImg(img)"
                @dblclick="onSelectImgAndAddCover(img)"
                :class="{selected: checkIsSelectedImg(img)}"
              />
            </div>
          </section>
        </div>

        <button type="button" @click="onAddCover" class="select-btn">
          {{ $getTrans('select') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppSpinner from './AppSpinner.vue'


import {mediaService} from '@/services/mediaService'
import {debounce} from '@/services/utilService'
import {coverImgs} from '@/services/constData'

export default {
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

  created() {
    this.user = structuredClone(this.loggedInUser)
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

    onGetImgs: debounce(async function () {
      if (!this.value) {
        this.imgs = null
        return
      }
      this.imgs = await mediaService.getImgs(this.value)
    }, 500),

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

  watch: {
    loggedInUser() {
      this.user = structuredClone(this.loggedInUser)
    },
  },

  components: {AppSpinner},
}
</script>
