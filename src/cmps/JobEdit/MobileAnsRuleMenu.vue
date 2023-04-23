<template>
  <div class="mobile-ans-rule-modal mobile-modal-content">
    <button
      v-for="ansRule in ansRules"
      :key="ansRule.txt"
      type="button"
      :disabled="!isOneTry || !verifyPerm(advancedPermsMap[ansRule.permission])"
      :class="{
        disabled: !isOneTry || !verifyPerm(advancedPermsMap[ansRule.permission]),
        selected: selectedAnsRule === ansRule.type,
      }"
      @click.stop="$emit('set-ans-rule', ansRule.type)"
    >
      <i class="icon material-icons">{{ ansRule.icon }}</i>
      {{ $getTrans(ansRule.txt) }}
    </button>
  </div>
</template>

<script>
import {advancedPermsMap, ansRules} from '@/services/constData'

export default {
  props: {
    isOneTry: Boolean,
    selectedAnsRule: {
      type: String,
      required: true,
    },
  },
  computed: {
    ansRules() {
      return ansRules
    },
    advancedPermsMap() {
      return advancedPermsMap
    },
  },

  methods: {
    verifyPerm(requiredPrm) {
      return this.$store.getters['auth/verifyPerm'](requiredPrm)
    },
  },
}
</script>
