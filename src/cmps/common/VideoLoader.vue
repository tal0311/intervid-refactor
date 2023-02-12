<template>
  <div class="video-loader">
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" />
    </svg>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.video-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

svg {
  animation: rotate 2s linear infinite reverse;

  circle {
    stroke: #e2e4e9;
    stroke-width: 7;
    stroke-dasharray: 283px;
    stroke-dashoffset: -283px;
    animation: load 2.8s cubic-bezier(0.53, 0.11, 0.57, 0.91) infinite;
  }

  @keyframes load {
    from {
      stroke-dashoffset: -283px;
    }
    to {
      stroke-dashoffset: 283px;
    }
  }

  @keyframes rotate {
    from {
      transform: scale(0.7) rotate(0deg);
    }
    to {
      transform: scale(0.7) rotate(360deg);
    }
  }
}
</style>
