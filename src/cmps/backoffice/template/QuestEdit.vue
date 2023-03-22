<template>
  <section class="quest-edit" v-if="mutableQuest">
    <div class="quest-header">
      <h4>{{ $getTrans('question') }} #{{ idx + 1 }}</h4>
      <quest-menu @on-remove-quest="onRemoveQuest" :quest="mutableQuest" />
    </div>

    <div class="quest-content">
      <main-input
        :input-name="`txt-${mutableQuest.id}`"
        :placeholder="$getTrans('question')"
        validate="required"
        v-model.trim="mutableQuest.txt"
        :on-blur="validateField"
        :errors="errors"
        styled="main"
      />

      <div v-if="isDesc" class="editor-container">
        <text-editor placeholder="Elaborate (optional)" v-model.trim="desc" :tools="['code', 'link']" />
        <opt-quest-edit @edit-opts="onEditOpts" :opts-to-edit="mutableQuest.opts" v-if="mutableQuest.opts" />
      </div>

      <p class="toggle-desc-btn" @click="isDesc = !isDesc">
        <i class="material-icons md-16">{{ isDesc ? 'remove' : 'add' }}</i>
        <span>{{ isDesc ? $getTrans('remove-description') : $getTrans('add-description') }}</span>
      </p>
    </div>

    <div class="answer-details">
      <basic-select @input="onChangeAnsRule" :default-value="ansRuleValue" :options="options" />

      <div class="time-limit">
        <i class="material-icons">schedule</i>
        <main-input
          input-name="timeLimit"
          type="number"
          validate="required|range"
          v-model.trim="mutableQuest.timeLimit"
          :on-blur="validateField"
          :errors="errors"
          styled="basic"
          value="1"
          max="30"
          min="1"
        />
        <span>{{ pluralMinute }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import TextEditor from '@/cmps/common/TextEditor.vue'
import OptQuestEdit from './OptQuestEdit.vue'
import QuestMenu from './QuestMenu.vue'

export default {
  props: ['quest', 'errors', 'idx'],

  data() {
    return {
      desc: this.quest.desc,
      isDesc: !!this.quest.desc,
      mutableQuest: this.quest,
    }
  },

  computed: {
    options() {
      return [
        {txt: 'video-only', value: 'isVidAns'},
        {txt: 'video-and-screen', value: 'isScreenAns,isVidAns'},
        // { txt: 'Video & Text', value: 'isTxtAns,isVidAns' },
      ]
    },

    pluralMinute() {
      if (!this.mutableQuest.timeLimit) return this.$getTrans('minute')
      return this.$getTrans(this.mutableQuest.timeLimit > 1 ? 'minutes' : 'minute')
    },

    ansRuleValue() {
      const values = []
      const {ansRule} = this.mutableQuest
      for (const rule in ansRule) {
        if (ansRule[rule]) {
          values.push(rule)
        }
      }
      values.sort((a, b) => a.localeCompare(b))
      return values.join(',')
    },
  },

  methods: {
    onChangeAnsRule(field) {
      const fields = field.split(',')
      const ansRule = fields.reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {})
      const quest = {...this.quest, ansRule}
      if (!this.isAnsRuleValid(quest)) return
      this.$emit('update-quest', quest)
    },

    onRemoveQuest() {
      this.$emit('remove-quest', this.mutableQuest.id)
    },

    isAnsRuleValid({ansRule}) {
      if (ansRule.isTxtAns && ansRule.isCodeAns) return false
      return ansRule.isVidAns || ansRule.isTxtAns || ansRule.isCodeAns
    },

    onEditOpts(opts) {
      const quest = {...this.mutableQuest}
      quest.opts = opts
      this.$emit('update-quest', quest)
    },

    validateField(ev) {
      this.$emit('validate-field', ev)
    },
  },

  watch: {
    quest() {
      this.desc = this.mutableQuest.desc
    },

    desc() {
      const newQuest = {...this.mutableQuest, desc: this.desc}
      this.$emit('update-quest', newQuest)
    },
  },

  components: {
    TextEditor,
    OptQuestEdit,
    QuestMenu,
  },
}
</script>
