<template>
  <div class="stepper">
    <div v-for="idx in stepCount" :key="idx" class="step">
      <label :class="{reached: idx - 1 <= currStep, completed: idx - 1 < currStep}"> </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stepCount: {
      type: Number,
      required: true,
    },
    currStep: {
      type: Number,
      required: true,
    },
  },
}
</script>
