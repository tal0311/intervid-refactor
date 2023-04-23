<template>
  <div class="video-recorder">
    <div class="recorder-wrapper">
      <video ref="video" autoplay playsinline></video>

      <div class="indicators">
        <div v-if="isRecording" class="recording">
          <div class="circle"></div>
          <span>Recording</span>
        </div>

        <div v-if="isAlmostDone" class="time-is-running-out">
          <p>{{ $getTrans('time-is-running-out') }}</p>
        </div>
      </div>
      <div v-if="!isRecording" class="no-recording-err">
        <p>{{ $getTrans('recording-has-not-yet-begun') }}</p>
        <p>{{ $getTrans('to-begin-recording-click-start-recording') }}</p>
      </div>

      <div v-if="isScreenAns" class="screen-preview-wrapper" :class="{open: isScreenPreviewOpen}">
        <div class="screen-header">
          <p>{{ $getTrans('your-screen-is-being-captured') }}</p>
          <i class="material-icons" @click="toggleScreenPreview">expand_more</i>
        </div>
        <video ref="screenVideo" playsinline></video>
      </div>

      <AudioMeter :stream="stream" />

      <InterviewErrorList :errors="errors" @reload="$emit('reload')" @remove-error="$emit('remove-error', $event)" />
    </div>
  </div>
</template>

<script>
import InterviewErrorList from '../interview/InterviewErrorList.vue'
import AudioMeter from '../interview/AudioMeter.vue'

export default {
  components: {InterviewErrorList, AudioMeter},
  props: ['currQuest', 'stream', 'errors', 'isScreenAns', 'isRecording', 'isAlmostDone'],

  data() {
    return {
      isScreenPreviewOpen: true,
    }
  },

  methods: {
    toggleScreenPreview() {
      this.isScreenPreviewOpen = !this.isScreenPreviewOpen
    },
  },
}
</script>
