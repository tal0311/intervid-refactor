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

<style lang="scss" scoped>
.animation-started {
  top: 100vh !important;
}
.confetti-animation {
  position: fixed;
  inset: -10px 0 0 0;
  z-index: 505;
  transition: top 5s ease-in;

  span {
    width: 10px;
    height: 30px;
    position: absolute;
    z-index: 5;
    bottom: 100%;
    animation: down var(--speed) var(--delay) ease-in forwards;

    @for $i from 0 to 100 {
      &:nth-child(#{$i + 1}) {
        --rotate-x: rotatex(#{random(360) + deg});
        --rotate-y: rotatey(#{random(360) + deg});
        --rotate-z: rotatez(#{random(360) + deg});
        --speed: #{(calc(calc(random(200) + 150) / 100) + s)};
        --delay: #{(calc(calc(random(50) + 50) / 100) + s)};
        --translate-z: translatez(#{random(300) * -1 + px});

        background: hsl(random(360), 100%, 50%);
        inset-inline-start: $i + vw;
      }
    }

    @keyframes down {
      from {
        bottom: calc(100% + 100px);
        transform: perspective(1000px) var(--translate-z) rotatex(0deg) rotatey(0deg) rotatez(0deg);
        opacity: 1;
      }
      to {
        bottom: calc(0% - 100px);
        transform: perspective(1000px) var(--translate-z) var(--rotate-x) var(--rotate-y) var(--rotate-z);
        opacity: 0;
      }
    }
  }
}
</style>
