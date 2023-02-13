<template>
  <div class="mobile-quest-edit-modal mobile-modal-content">
    <button @click="onRemoveQuest">{{ getTrans("remove") }}</button>
  </div>
</template>

<script>
export default {
  methods: {
    onRemoveQuest() {
      this.$emit("on-close");
      this.$emit("on-remove-quest");
    },
  },
};
</script>
