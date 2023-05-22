<template>
  <div class="confetti-animation" :class="{['animation-started']: isAnimationstarted}">
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span
    ><span></span><span></span><span></span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAnimationStarted: false,
    }
  },

  mounted() {
    setTimeout(() => {
      this.isAnimationStarted = true
    }, 1000)
  },
}
</script>
