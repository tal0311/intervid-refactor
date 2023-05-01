<template>
  <section class="video-list">
    <VideoPreview
      v-for="(answer, key, idx) in applicant.answerMap"
      :key="key"
      :answer="answer"
      :idx="idx"
      :quest="quests.find((quest) => quest.id === key)"
      :selected-quest-idx="selectedQuestIdx"
      @go-to-quest="$emit('go-to-quest', idx)"
    />
  </section>
</template>

<script>
import VideoPreview from './VideoPreview.vue'

export default {
  components: {VideoPreview},
  props: {
    applicant: {
      type: Object,
      required: true,
    },
    quests: {
      type: Array,
      required: true,
    },
    selectedQuestIdx: {
      type: Number,
      required: true,
    },
  },
  emits: ['go-to-quest'],
}
</script>
