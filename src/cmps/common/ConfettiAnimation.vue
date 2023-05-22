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
      isAnimationstarted: false,
    }
  },

  mounted() {
    setTimeout(() => {
      this.isAnimationstarted = true
    }, 1000)
  },
}
</script>
