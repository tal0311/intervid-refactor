<template>
  <section
    v-if="isAnswerExist"
    class="video-preview"
    :class="{ selected: idx === selectedQuestIdx }"
    @click="$emit('go-to-quest', idx)"
  >
    <div class="answer-info">
      <div class="top">
        <p>{{ getTrans('question') }} {{ idx + 1 }} - {{ quest.txt }}</p>
        <div class="icons-container">
          <i v-if="answer.faceUrl" class="material-icons">videocam</i>
          <i v-if="answer.screenUrl" class="material-icons">desktop_windows</i>
        </div>
      </div>
      <div class="bottom">
        <p class="duration">{{ secondsToTime(answerDuration) }} / {{ secondsToTime(quest.timeLimit * 60) }}</p>
        <p v-if="quest.desc" class="desc" ref="desc" v-mounted :class="{ expand: isExpand }" v-html="description"></p>
      </div>
      <button class="show-more-btn" v-if="quest.desc && idx === selectedQuestIdx && isOverflowing">
        <span @click="toggleExpand">{{ isExpand ? getTrans('read-less') : getTrans('read-more') }}</span>
        <i class="material-icons">{{ isExpand ? 'expand_less' : 'expand_more' }}</i>
      </button>
    </div>
  </section>
</template>

<script>
import { getVideoLength, secondsToTime } from '@/services/utilService'

export default {
  props: ['answer', 'idx', 'quest', 'selectedQuestIdx'],

  data() {
    return {
      answerDuration: 0,
      isExpand: false,
      isOverflowing: null,
    }
  },

  computed: {
    description() {
      var div = document.createElement('div')
      div.innerHTML = this.quest.desc
      return div.innerHTML
    },

    isAnswerExist() {
      return !!this.quest && (!!this.answer.faceUrl || !!this.answer.screenUrl)
    },
  },

  methods: {
    secondsToTime(answerTime) {
      return secondsToTime(answerTime)
    },

    toggleExpand() {
      this.isExpand = !this.isExpand
    },
  },

  watch: {
    async 'answer.faceUrl'() {
      this.answerDuration = await getVideoLength(this.answer.faceUrl)
    },
  },

  directives: {
    mounted(el, _, { context }) {
      if (
        context.selectedQuestIdx === context.idx &&
        el.scrollHeight &&
        el.clientHeight &&
        context.isOverflowing === null
      ) {
        context.isOverflowing = el.scrollHeight > el.clientHeight
      }
    },
  },
}
</script>
