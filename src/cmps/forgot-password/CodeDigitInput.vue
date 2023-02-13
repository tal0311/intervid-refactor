<template>
  <input
    type="number"
    :value="$attrs.value"
    :disabled="$attrs.disabled"
    @keydown="type"
    @paste.prevent="paste"
    name="code-digit"
    autocomplete="nope"
    @keydown.left.right="moveInput"
    @keydown.delete="$emit('remove', idx)"
  />
</template>

<script>
export default {
  props: ["idx"],

  methods: {
    type(event) {
      const key = event.key.replace(/\D/g, "");
      if (key) {
        event.preventDefault();
        this.$emit("input", key);
        this.$nextTick(() => {
          this.$emit("go-to", this.idx + 1);
        });
      } else if (!event.ctrlKey) {
        event.preventDefault();
      }
    },

    paste(event) {
      let pastedVal = event.clipboardData.getData("text");
      pastedVal = pastedVal.replace(/\D/g, "");
      pastedVal = pastedVal.substring(0, this.length);
      pastedVal = pastedVal.split("");
      if (pastedVal) {
        this.$emit("paste", pastedVal);
      }
    },

    moveInput(event) {
      const diff = event.keyCode === 37 ? -1 : 1;
      this.$emit("go-to", this.idx + diff);
    },
  },
};
</script>
