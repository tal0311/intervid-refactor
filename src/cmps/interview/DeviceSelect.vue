<template>
  <section class="device-select" ref="modal-wrapper">
    <div class="select-device-menu" @click="toggleAnswerModal(mediaType)" :class="{open: isAnswerModalOpen}">
      <button class="device-select-btn">
        <label>{{ $getTrans(mediaType) }}</label>
        <div>
          <p>{{ selectedDeviceName }}</p>
          <i v-if="devices.length > 1" class="expand material-icons">expand_more</i>
        </div>
      </button>

      <div class="device-modal" v-if="devices.length > 1">
        <p
          v-for="device in devices"
          :key="device.id"
          :class="{selected: selectedDeviceId === device.id}"
          @click.stop="onSetInputDevice(mediaType + 'input', device.id)"
        >
          {{ device.name }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modalHight: 290,
    }
  },

  props: ['selectedDeviceId', 'devices', 'type'],

  unmounted() {
    if (this.isAnswerModalOpen) this.toggleAnswerModal()
  },

  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },

    isAnswerModalOpen() {
      return this.modal.type === 'mediaType' && this.modal.data.mediaType === this.mediaType
    },

    mediaType() {
      if (this.type === 'microphone') return 'audio'
      else if (this.type === 'camera') return 'video'
      else return ''
    },

    currDevice() {
      return this.devices.find((device) => this.selectedDeviceId === device.id)
    },

    selectedDeviceName() {
      return this.currDevice?.name || (this.devices[0]?.name && this.devices[0].name) || 'Not recognized'
    },
  },

  methods: {
    toggleAnswerModal(mediaType) {
      const modalId = this.isAnswerModalOpen ? null : this.selectedDeviceId
      this.$store.dispatch('app/toggleModal', {
        type: 'mediaType',
        data: {modalId, mediaType},
      })
    },

    closeAnswerModal() {
      if (this.isAnswerModalOpen) this.$store.dispatch('app/toggleModal', {type: 'null'})
    },

    onSetInputDevice(type, id) {
      localStorage.setItem(type, id)
      this.$emit('set-device', {type, id})
      this.closeAnswerModal()
    },
  },
}
</script>
