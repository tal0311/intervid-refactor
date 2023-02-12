<template>
  <div class="mobile-ans-rule-modal mobile-modal-content">
    <button
      type="button"
      v-for="ansRule in ansRules"
      :key="ansRule.txt"
      @click.stop="$emit('set-ans-rule', ansRule.type)"
      :disabled="!isOneTry || !verifyPerm(advancedPermsMap[ansRule.permission])"
      :class="{
        disabled: !isOneTry || !verifyPerm(advancedPermsMap[ansRule.permission]),
        selected: selectedAnsRule === ansRule.type,
      }"
    >
      <i class="icon material-icons">{{ansRule.icon}}</i>
      {{getTrans(ansRule.txt)}}
    </button>
  </div>
</template>

<script>
import { advancedPermsMap, ansRules } from '@/services/constData'
import { userService } from '@/services/userService'

export default {
  props: ['isOneTry', 'selectedAnsRule'],

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
      return userService.verifyPerm(requiredPrm)
    },
  },
}
</script>

