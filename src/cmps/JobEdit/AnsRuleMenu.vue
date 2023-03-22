<template>
  <section class="ans-rule-container">
    <div
      class="ans-rule"
      @click="toggleAnswerModal"
      :class="{
        open: isOpen,
        disabled: !isOneTry && selectedAnsRule === 'isScreenAns',
      }"
    >
      <i class="icon material-icons">
        {{ selectedAnsRule === 'isVidAns' ? 'videocam' : 'desktop_windows' }}
      </i>

      <button type="button">
        {{ $getTrans(answerType) }}
        <i class="expand material-icons">expand_more</i>
      </button>

      <div class="answer-modal" v-if="!isMobile">
        <button
          type="button"
          v-for="ansRule in ansRules"
          :key="ansRule.txt"
          @click.stop="setAnsRule(ansRule.type)"
          :disabled="(!isOneTry && ansRule.type === 'isScreenAns') || !verifyPerm(advancedPermsMap[ansRule.permission])"
          :class="{
            disabled:
              (!isOneTry && ansRule.type === 'isScreenAns') || !verifyPerm(advancedPermsMap[ansRule.permission]),
            selected: selectedAnsRule === ansRule.type,
          }"
        >
          <i class="icon material-icons">{{ ansRule.icon }}</i>
          {{ $getTrans(ansRule.txt) }}
        </button>
      </div>

      <mobile-modal
        v-else-if="isOpen"
        cmp-name="ans-rule-menu"
        @on-close="toggleAnswerModal"
        :is-one-try="isOneTry"
        :selected-ans-rule="selectedAnsRule"
        @set-ans-rule="setAnsRule($event)"
      />
    </div>

    <p class="ans-rule-error" v-if="!isOneTry && selectedAnsRule === 'isScreenAns'">
      {{ $getTrans('answer-type-not-available') }}
    </p>
  </section>
</template>

<script>
import {templateService} from '@/services/templateService'
import {advancedPermsMap, getAnswerType, ansRules} from '@/services/constData'
import MobileModal from '../common/modals/MobileModal.vue'

export default {
  props: {
    quest: {
      type: Object,
      required: true,
    },
    isOneTry: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['change-ans'],
  data() {
    return {
      selectedAnsRule: this.quest.ansRule.isVidAns ? 'isVidAns' : 'isScreenAns',
      mutableQuest: this.quest,
    }
  },

  computed: {
    modal() {
      return this.$store.getters['app/modal']
    },

    isOpen() {
      return this.modal.type === 'ans-rule-menu' && this.modal.data.modalId === this.mutableQuest.id
    },

    answerType() {
      return getAnswerType(this.selectedAnsRule)
    },

    advancedPermsMap() {
      return advancedPermsMap
    },

    ansRules() {
      return ansRules
    },

    isMobile() {
      return this.$store.getters['app/isMobile']
    },
  },

  methods: {
    onChangeAnsRule() {
      const ansRule = templateService.getDefaultAnsRule()
      this.mutableQuest.ansRule = {
        ...ansRule,
        [this.selectedAnsRule]: true,
      }
      this.$emit('change-ans')
    },

    toggleAnswerModal() {
      const modalId = this.isOpen ? null : this.mutableQuest.id
      this.$store.dispatch('app/toggleModal', {
        type: 'ans-rule-menu',
        data: {modalId},
      })
    },

    verifyPerm(requiredPrm) {
      return this.$store.getters['auth/verifyPerm'](requiredPrm)
    },

    setAnsRule(ansRule) {
      if (!this.isOneTry && ansRule === 'isScreenAns') return // TODO: remove this in v2
      this.toggleAnswerModal()
      this.selectedAnsRule = ansRule
    },
  },

  watch: {
    selectedAnsRule() {
      this.onChangeAnsRule()
    },
  },

  components: {MobileModal},
}
</script>
