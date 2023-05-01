<template>
  <div :class="`pie-wrapper ${progressClass} style-2`">
    <span class="label"
      >{{ textToShow }}
      <span v-if="!labelTxt" class="smaller">%</span>
    </span>
    <div class="pie">
      <div class="left-side half-circle"></div>
      <div class="right-side half-circle"></div>
    </div>
    <div class="shadow"></div>
  </div>
</template>

<script>
export default {
  props: {
    donePercent: {
      type: Number,
      required: true,
    },
    labelTxt: {
      type: String,
      default: null,
    },
  },

  computed: {
    textToShow() {
      return this.labelTxt === null || this.labelTxt === undefined ? this.donePercent : this.labelTxt
    },

    progressClass() {
      return `progress-${this.donePercent}`
    },
  },
}
</script>
