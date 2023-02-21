<template>
  <section class="animation">
    <div class="cloud">
      <i></i>
      <i></i>
      <i></i>
    </div>

    <div class="video-container" v-html="svgs.video"></div>

    <div class="laptop" v-html="svgs.laptop"></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      svgs: {laptop: '', video: ''},
    }
  },

  created() {
    this.svgs.laptop = this.getSvg('laptopUploadingAnimation')
    this.svgs.video = this.getSvg('videoUploadingAnimation')
  },
}
</script>

<style lang="scss" scoped>
$size: 70px;
$animation-duration: 10s;

.animation {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size * 1.7;
  aspect-ratio: 1/2;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    width: 2px;
    border-left: 2px dashed #0005;
    transform: translatex(-50%);
    height: 69%;
    top: 0;
    left: 50%;
  }

  .cloud {
    position: absolute;
    z-index: 15;
    width: $size * 2.5;
    height: $size * 1.25;
    transform: translatey(-40%) scale(1.2);
    top: 0;

    i {
      position: absolute;
      display: inline-block;
      bottom: 0;
      height: 100%;
      background: #bbe9f7;
      transform-origin: bottom;
      border-radius: 50vw;
      animation: cloud calc(#{$animation-duration} / 3) infinite;
      box-shadow: inset -3px 3px 0px 3px lighten(#bbe9f7, 10%);

      @keyframes cloud {
        0%,
        10%,
        50%,
        100% {
          transform: scale(1);
        }
        30% {
          transform: scale(1.1);
        }
      }

      &:nth-child(1) {
        left: 0;
        width: 80%;
        height: 60%;
        animation-delay: calc(#{$animation-duration} / 150 * 0 + #{$animation-duration} / 5);
      }

      &:nth-child(2) {
        left: 22.5%;
        width: 50%;
        height: 100%;
        bottom: 1px;
        animation-delay: calc(#{$animation-duration} / 150 * 1 + #{$animation-duration} / 5);
      }

      &:nth-child(3) {
        right: 0;
        width: 60%;
        height: 70%;
        animation-delay: calc(#{$animation-duration} / 150 * 3 +#{$animation-duration} / 5);
      }
    }
  }

  .video-container {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .video-1,
    .video-2,
    .video-3 {
      position: absolute;
      width: $size;
      transform-style: preserve-3d;
      transform: translatey(#{$size * 3});
    }

    .video-1 {
      animation: upload-left $animation-duration calc(#{$animation-duration} / 3 * 0) infinite;
    }

    .video-2 {
      animation: upload-right $animation-duration calc(#{$animation-duration} / 3 * 1) infinite;
    }

    .video-3 {
      animation: upload-left $animation-duration calc(#{$animation-duration} / 3 * 2) infinite;
    }

    @keyframes upload-left {
      0% {
        transform: translatex($size * -2) translatey(#{$size * 1.7});
      }
      6% {
        transform: translatey(#{$size * 1.7});
      }
      50%,
      100% {
        transform: translatey(#{$size * -2.5});
      }
    }

    @keyframes upload-right {
      0% {
        transform: translatex($size * 2) translatey(#{$size * 1.7});
      }
      6% {
        transform: translatey(#{$size * 1.7});
      }
      50%,
      100% {
        transform: translatey(#{$size * -2.5});
      }
    }
  }

  .laptop {
    position: absolute;
    bottom: -19%;
    z-index: -1;
    width: $size * 2.4;
  }
}
</style>
