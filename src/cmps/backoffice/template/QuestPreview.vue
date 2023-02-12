<template>
  <div class="quest-preview container">
    <span class="title">{{getTrans('question')}} {{idx + 1}} - {{quest.txt || getTrans('untitled-job')}}</span>
    <div class="desc" v-html="quest.desc"></div>
    <div class="rule">
      <div class="answer-type">
        <p v-if="quest.ansRule.isTextAns"><i class="material-icons">text_snippet</i>{{getTrans('text-answer')}}</p>
        <p v-else-if="quest.ansRule.isScreenAns">
          <i class="material-icons">desktop_windows</i>{{getTrans('screen-answer')}}
        </p>
        <p v-else-if="quest.ansRule.isVidAns"><i class="material-icons">videocam</i>{{getTrans('video-answer')}}</p>
      </div>
      <div class="timeLimit">
        <i class="material-icons">access_time</i>
        <span>{{quest.timeLimit}} {{getTrans('minutes')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['quest', 'idx'],
}
</script>
