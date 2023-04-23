<template>
  <section class="interview-error-list">
    <div v-for="(error, idx) in errors" :key="idx" class="error-preview">
      <div class="error-info">
        <div>
          <i class="material-icons" :style="{color: error.isBlocking ? '#ff5a5a' : '#fffa55'}"> warning_amber </i>
          <p>
            {{ $getTrans(`${error.type}_TXT`) }}
            <span v-if="error.desc" @click="toggleDescription(idx)">{{
              openDescIdx === idx ? $getTrans('read-less') : $getTrans('read-more')
            }}</span>
          </p>
        </div>
      </div>
      <div v-if="openDescIdx === idx" class="error-desc">
        <pre>{{ $getTrans(`${error.type}_DESC${getAdditionTag(error.type)}`) }}</pre>
      </div>
      <button v-if="!error.isBlocking" class="material-icons" @click="$emit('remove-error', error)">close</button>
    </div>
    <button v-if="errors.length && reloadTxt" class="reload-btn" @click="$emit('reload')">
      {{ $getTrans(reloadTxt) }}
    </button>
  </section>
</template>

<script>
import {screenErrorMap, videoErrorMap} from '@/services/errorService'

export default {
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
  emits: ['reload', 'remove-error'],
  data() {
    return {
      openDescIdx: null,
    }
  },

  computed: {
    reloadTxt() {
      const error = this.errors.find((error) => error.reload)
      return error ? error.reload : ''
    },

    browser() {
      return this.$store.getters['app/browser']
    },
  },

  methods: {
    toggleDescription(idx) {
      this.openDescIdx = this.openDescIdx === idx ? null : idx
    },

    getAdditionTag(errorType) {
      const browserName = this.browser.name
      const browserAdditionErrors = [videoErrorMap.DENIED_CAM_ACCESS.type, videoErrorMap.DENIED_MIC_ACCESS.type]
      if (browserAdditionErrors.includes(errorType)) {
        const browsers = ['safari', 'chrome', 'firefox', 'edge-chromium']
        if (browsers.includes(browserName)) return '_' + browserName.toUpperCase().replace('-', '_')
      }

      const {os} = this.browser
      const deviceAdditionErrors = [videoErrorMap.MIC_NOT_FOUND.type, videoErrorMap.CAMERA_NOT_FOUND.type]
      const matchedDeviceName = ['mac', 'windows'].find((device) => {
        const regex = new RegExp(device, 'i')
        return 'Mac OS'.match(regex)
      })
      if (deviceAdditionErrors.includes(errorType)) {
        if (matchedDeviceName) return '_' + matchedDeviceName.toUpperCase()
      }

      if (errorType === screenErrorMap.DENIED_SCREEN_ACCESS.type && os === 'Mac OS') {
        return '_' + matchedDeviceName.toUpperCase()
      }
      if (errorType === screenErrorMap.DENIED_SCREEN_ACCESS.type && browserName === 'firefox') {
        return '_' + browserName.toUpperCase()
      }
      return ''
    },
  },
}
</script>
