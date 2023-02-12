<template>
  <div class="video-recorder">
    <div class="recorder-wrapper">
      <video autoplay ref="video" playsinline></video>

      <div class="indicators">
        <div class="recording" v-if="isRecording">
          <div class="circle"></div>
          <span>Recording</span>
        </div>

        <div v-if="isAlmostDone" class="time-is-running-out">
          <p>{{getTrans('time-is-running-out')}}</p>
        </div>
      </div>
      <div v-if="!isRecording" class="no-recording-err">
        <p>{{getTrans('recording-has-not-yet-begun')}}</p>
        <p>{{getTrans('to-begin-recording-click-start-recording')}}</p>
      </div>

      <div class="screen-preview-wrapper" v-if="isScreenAns" :class="{ open: isScreenPreviewOpen }">
        <div class="screen-header">
          <p>{{getTrans('your-screen-is-being-captured')}}</p>
          <i class="material-icons" @click="toggleScreenPreview">expand_more</i>
        </div>
        <video ref="screenVideo" playsinline></video>
      </div>

      <audio-meter :stream="stream" />

      <interview-error-list :errors="errors" @reload="$emit('reload')" @remove-error="$emit('remove-error', $event)" />
    </div>
  </div>
</template>

<script>
import InterviewErrorList from '../interview/InterviewErrorList.vue'
import AudioMeter from '../interview/AudioMeter.vue'

export default {
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

  components: { InterviewErrorList, AudioMeter },
}
</script>
