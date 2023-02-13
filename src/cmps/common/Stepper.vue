<template>
  <div class="stepper">
    <div class="step" v-for="idx in stepCount" :key="idx">
      <label
        :class="{ reached: idx - 1 <= currStep, completed: idx - 1 < currStep }"
      >
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: ["stepCount", "currStep"],
};
</script>
