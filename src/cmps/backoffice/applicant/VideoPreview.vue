<template>
  <section
    v-if="isAnswerExist"
    class="video-preview"
    :class="{selected: idx === selectedQuestIdx}"
    @click="$emit('go-to-quest', idx)"
  >
    <div class="answer-info">
      <div class="top">
        <p>{{ $getTrans('question') }} {{ idx + 1 }} - {{ quest.txt }}</p>
        <div class="icons-container">
          <i v-if="answer.faceUrl" class="material-icons">videocam</i>
          <i v-if="answer.screenUrl" class="material-icons">desktop_windows</i>
        </div>
      </div>
      <div class="bottom">
        <p class="duration">
          {{ secondsToTime(answerDuration) }} /
          {{ secondsToTime(quest.timeLimit * 60) }}
        </p>
        <p v-if="quest.desc" ref="desc" v-mounted class="desc" :class="{expand: isExpand}" v-html="description"></p>
      </div>
      <button v-if="quest.desc && idx === selectedQuestIdx && isOverflowing" class="show-more-btn">
        <span @click="toggleExpand">{{ isExpand ? $getTrans('read-less') : $getTrans('read-more') }}</span>
        <i class="material-icons">{{ isExpand ? 'expand_less' : 'expand_more' }}</i>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  directives: {
    // attention!! the name of this directive is "mounted" - and it used on the the "<p>" tag in line 21.
    mounted(el, _, vnode) {
      const {ctx: cmp} = vnode.ctx // to get something from the "this" of the component, we need to get "vnode.ctx.ctx"
      if (cmp.selectedQuestIdx === cmp.idx && el.scrollHeight && el.clientHeight && cmp.isOverflowing === null) {
        cmp.isOverflowing = el.scrollHeight > el.clientHeight
      }
    },
  },
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

  watch: {
    async 'answer.faceUrl'() {
      this.answerDuration = await this.$utilService.getVideoLength(this.answer.faceUrl)
    },
  },

  methods: {
    secondsToTime(answerTime) {
      return this.$utilService.secondsToTime(answerTime)
    },

    toggleExpand() {
      this.isExpand = !this.isExpand
    },
  },
}
</script>
