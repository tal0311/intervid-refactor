<template>
  <div class="img-upload" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="img-preview">
      <img :src="imgPreview || initialImg || defaultImg" referrerpolicy="no-referrer" />
      <button class="material-icons">photo_camera</button>
    </div>

    <AppSpinner v-if="isUploading" />

    <label class="upload-label" :for="`upload-${id}`"> </label>
    <input :id="`upload-${id}`" type="file" name="" accept="image/*" @input="onUploadImg" />
  </div>
</template>

<script>
import {mediaService} from '@/services/mediaService'
import AppSpinner from './AppSpinner.vue'

export default {
  components: {AppSpinner},
  props: {
    initialImg: {
      type: String,
      default: '',
    },
  },
  emits: ['upload'],

  data() {
    return {
      isUploading: false,
      imgPreview: null,
      isHovered: false,
    }
  },

  computed: {
    defaultImg() {
      return `https://graffiti-online.co.il/images/notfound.png`
    },
  },

  created() {
    this.id = this.$utilService.makeCmpId()
  },

  methods: {
    async onUploadImg(ev) {
      this.isUploading = true
      const file = ev.target.files[0]
      const filesize = (file.size / 1024).toFixed(4) // KB
      if (filesize > 200) {
        alert('File size is too large')
        this.isUploading = false
        return
      }
      const imgSrc = await mediaService.readFile(file)
      const imgUrl = await mediaService.uploadImg(imgSrc)
      this.isUploading = false
      this.imgPreview = imgUrl
      this.$emit('upload', imgUrl)
    },
  },
}
</script>
