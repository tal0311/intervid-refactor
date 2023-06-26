<template>
  <section class="ans-rule-container">
    <div
      class="ans-rule"
      :class="{
        open: isOpen,
        disabled: !isOneTry && selectedAnsRule === 'isScreenAns',
      }"
      @click="toggleAnswerModal"
    >
      <i class="icon material-icons">
        {{ selectedAnsRule === 'isVidAns' ? 'videocam' : 'desktop_windows' }}
      </i>

      <button type="button">
        {{ $getTrans(answerType) }}
        <i class="expand material-icons">expand_more</i>
      </button>

      <div v-if="!isMobileScreen" class="answer-modal">
        <button
          v-for="ansRule in ansRules"
          :key="ansRule.txt"
          type="button"
          :disabled="(!isOneTry && ansRule.type === 'isScreenAns') || !verifyPerm(advancedPermsMap[ansRule.permission])"
          :class="{
            disabled:
              (!isOneTry && ansRule.type === 'isScreenAns') || !verifyPerm(advancedPermsMap[ansRule.permission]),
            selected: selectedAnsRule === ansRule.type,
          }"
          @click.stop="setAnsRule(ansRule.type)"
        >
          <i class="icon material-icons">{{ ansRule.icon }}</i>
          {{ $getTrans(ansRule.txt) }}
        </button>
      </div>

      <MobileModal
        v-else-if="isOpen"
        cmp-name="ans-rule-menu"
        :is-one-try="isOneTry"
        :selected-ans-rule="selectedAnsRule"
        @on-close="toggleAnswerModal"
        @set-ans-rule="setAnsRule($event)"
      />
    </div>

    <p v-if="!isOneTry && selectedAnsRule === 'isScreenAns'" class="ans-rule-error">
      {{ $getTrans('answer-type-not-available') }}
    </p>
  </section>
</template>

<script>
import {templateService} from '@/services/templateService'
import {advancedPermsMap, getAnswerType, ansRules} from '@/services/constData'
import MobileModal from '../common/modals/MobileModal.vue'

export default {
  components: {MobileModal},
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

    isMobileScreen() {
      return this.$store.getters['app/isMobileScreen']
    },
  },

  watch: {
    selectedAnsRule() {
      this.onChangeAnsRule()
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
}
</script>
