<template>
  <div class="not-supported">
    <i class="material-icons">warning_amber</i>
    <h1>{{ $getTrans(`${err.type}_TXT`) }}</h1>
    <h3>{{ $getTrans(`${err.type}_DESC`) }}</h3>

    <!-- Chrome -->
    <div class="browser-list">
      <a
        class="browser-card"
        v-if="!isVersionErr || (isVersionErr && browserName === 'chrome')"
        href="https://www.google.com/chrome/?hl=en_GB"
        target="_blank"
      >
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1661182483/Frontend/chrome-icon_pduw7x.png"
          alt="Google Chrome"
        />
        <p>Google Chrome</p>
      </a>

      <!-- Firefox -->
      <a
        class="browser-card"
        v-if="!isVersionErr || (isVersionErr && browserName === 'firefox')"
        href="https://www.mozilla.com/firefox/"
        target="_blank"
      >
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1661182487/Frontend/firefox-icon_elmz5x.png"
          alt="Firefox"
        />
        <p>Firefox</p>
      </a>

      <!-- Safari -->
      <a
        class="browser-card"
        v-if="!isVersionErr || (isVersionErr && browserName === 'safari')"
        href="https://www.apple.com/safari/"
        target="_blank"
      >
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1661182489/Frontend/safari-icon_nmnelb.png"
          alt="Safari"
        />
        <p>Safari</p>
      </a>

      <!-- Edge -->
      <a
        class="browser-card"
        v-if="!isVersionErr || (isVersionErr && browserName === 'edge-chromium')"
        href="https://www.microsoft.com/en-us/edge"
        target="_blank"
      >
        <img
          loading="lazy"
          src="https://res.cloudinary.com/intervid/image/upload/v1665050047/Frontend/safari-icon_u8ugc9.png"
          alt="Microsoft Edge"
        />
        <p>Microsoft Edge</p>
      </a>
    </div>
  </div>
</template>

<script>
import {browserErrorMap} from '@/services/errorService'

export default {
  props: {
    err: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isVersionErr() {
      return this.err.type === browserErrorMap.NO_VERSION_SUPPORT.type
    },

    browserName() {
      return this.$store.getters['app/browser'].name
    },
  },

  methods: {},
}
</script>
