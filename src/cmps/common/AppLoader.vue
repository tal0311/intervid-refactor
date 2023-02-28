<template>
  <div class="loader-wrapper" :class="{local: isLocal}">
    <div class="loader" v-html="loaderSvg"></div>
  </div>
</template>

<script>
import {getSvg} from '@/services/svgService'

export default {
  props: ['isLocal'],

  data() {
    return {
      loaderSvg: '',
    }
  },

  created() {
    this.loaderSvg = getSvg('loader')
  },
}
</script>
