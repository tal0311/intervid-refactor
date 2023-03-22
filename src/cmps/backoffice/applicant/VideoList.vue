<template>
  <section class="video-list">
    <video-preview
      v-for="(answer, key, idx) in applicant.answerMap"
      :answer="answer"
      :key="key"
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
  props: ['applicant', 'quests', 'selectedQuestIdx'],

  components: {VideoPreview},
}
</script>
