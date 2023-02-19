<template>
  <div class="loader-wrapper" :class="{ local: isLocal }">
    <div class="loader" v-html="loaderSvg"></div>
  </div>
</template>

<script>
export default {
  props: ["isLocal"],

  data() {
    return {
      loaderSvg: "",
    };
  },

  created() {
    this.loaderSvg = this.getSvg("loader");
  },
};
</script>
